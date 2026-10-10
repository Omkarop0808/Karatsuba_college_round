// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./IVerityVerifier.sol";

contract VerityRegistry is ReentrancyGuard {
    uint256 public constant MIN_WORKER_STAKE = 0.05 ether;
    uint256 public constant CHALLENGE_WINDOW_BLOCKS = 50;

    enum Status { None, Requested, Submitted, Challenged, Finalized, Refunded, Slashed }

    struct Task {
        address requester;
        bytes32 codeCommitment;
        bytes32 inputCommitment;
        uint256 bounty;
        uint64 deadline;
        address worker;
        bytes32 outputCommitment;
        uint64 challengeEnd;
        Status status;
    }

    uint256 public nextTaskId;
    mapping(uint256 => Task) public tasks;
    mapping(address => uint256) public workerStakes;
    
    IVerityVerifier public immutable verifier;
    address public disputeManager;

    event TaskRequested(uint256 indexed taskId, address indexed requester, bytes32 codeHash, bytes32 inputHash, uint256 bounty, uint64 deadline);
    event WorkerRegistered(address indexed worker, uint256 amount);
    event TaskSubmitted(uint256 indexed taskId, address indexed worker, bytes32 outputCommitment);
    event TaskFinalized(uint256 indexed taskId);
    event Refunded(uint256 indexed taskId);

    error InvalidProof();
    error PublicSignalsMismatch();
    error InputHashMismatch();
    error TaskNotFound();
    error BadStatus();
    error DeadlinePassed();
    error WindowOpen();
    error WindowClosed();
    error InsufficientStake();
    error NotRequester();
    error TransferFailed();
    error Unauthorized();

    constructor(address _verifier) {
        verifier = IVerityVerifier(_verifier);
    }

    function setDisputeManager(address _disputeManager) external {
        require(disputeManager == address(0), "Already set");
        disputeManager = _disputeManager;
    }

    modifier onlyDisputeManager() {
        if (msg.sender != disputeManager) revert Unauthorized();
        _;
    }

    function registerWorker() external payable {
        if (msg.value < MIN_WORKER_STAKE && workerStakes[msg.sender] < MIN_WORKER_STAKE) {
            revert InsufficientStake();
        }
        workerStakes[msg.sender] += msg.value;
        emit WorkerRegistered(msg.sender, workerStakes[msg.sender]);
    }

    function requestComputation(
        bytes32 codeCommitment,
        bytes32 inputCommitment,
        uint64 timeoutSec
    ) external payable returns (uint256) {
        require(msg.value > 0, "Bounty required");
        
        uint256 taskId = nextTaskId++;
        tasks[taskId] = Task({
            requester: msg.sender,
            codeCommitment: codeCommitment,
            inputCommitment: inputCommitment,
            bounty: msg.value,
            deadline: uint64(block.timestamp + timeoutSec),
            worker: address(0),
            outputCommitment: bytes32(0),
            challengeEnd: 0,
            status: Status.Requested
        });

        emit TaskRequested(taskId, msg.sender, codeCommitment, inputCommitment, msg.value, tasks[taskId].deadline);
        return taskId;
    }

    function submitResult(
        uint256 taskId,
        bytes32 outputCommitment,
        IVerityVerifier.ProofPoints calldata proof,
        uint256[] calldata signals
    ) external {
        if (workerStakes[msg.sender] < MIN_WORKER_STAKE) revert InsufficientStake();
        Task storage task = tasks[taskId];
        if (task.status != Status.Requested) revert BadStatus();
        if (block.timestamp > task.deadline) revert DeadlinePassed();
        if (signals[0] != uint256(task.inputCommitment)) revert InputHashMismatch();
        
        // ZK Verification
        bool isValid = verifier.verifyProof(proof, signals);
        if (!isValid) revert InvalidProof(); 

        // Also check if public outputs match our output commitments 
        if (signals[1] != uint256(outputCommitment)) revert PublicSignalsMismatch();

        task.worker = msg.sender;
        task.outputCommitment = outputCommitment;
        task.status = Status.Submitted;
        task.challengeEnd = uint64(block.number + CHALLENGE_WINDOW_BLOCKS);

        emit TaskSubmitted(taskId, msg.sender, outputCommitment);
    }

    function finalizeTask(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        if (task.status != Status.Submitted) revert BadStatus();
        if (block.number <= task.challengeEnd) revert WindowOpen();

        task.status = Status.Finalized;
        
        uint256 bountyPayout = task.bounty;
        task.bounty = 0;
        
        (bool ok, ) = payable(task.worker).call{value: bountyPayout}("");
        if (!ok) revert TransferFailed();

        emit TaskFinalized(taskId);
    }

    function claimTimeoutRefund(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        if (task.status != Status.Requested) revert BadStatus();
        if (block.timestamp <= task.deadline) revert BadStatus();
        if (msg.sender != task.requester) revert NotRequester();

        task.status = Status.Refunded;
        
        uint256 refund = task.bounty;
        task.bounty = 0;
        
        (bool ok, ) = payable(task.requester).call{value: refund}("");
        if (!ok) revert TransferFailed();

        emit Refunded(taskId);
    }

    function slashWorker(address worker, uint256 amount) external onlyDisputeManager {
        if (workerStakes[worker] >= amount) {
            workerStakes[worker] -= amount;
        } else {
            workerStakes[worker] = 0;
        }
    }

    function setTaskStatus(uint256 taskId, Status newStatus) external onlyDisputeManager {
        tasks[taskId].status = newStatus;
    }

    function updateChallengeEnd(uint256 taskId, uint64 newEnd) external onlyDisputeManager {
        tasks[taskId].challengeEnd = newEnd;
    }

    function payout(address to, uint256 amount) external onlyDisputeManager {
        (bool ok, ) = payable(to).call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    function zeroTaskBounty(uint256 taskId) external onlyDisputeManager {
        tasks[taskId].bounty = 0;
    }
}