// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./IVerityVerifier.sol";

contract VerityRegistry is ReentrancyGuard {
    uint256 public constant MIN_WORKER_STAKE = 0.05 ether;
    uint256 public constant CHALLENGE_WINDOW_BLOCKS = 50;

    enum Status { None, Requested, Submitted, Challenged, Finalized, Refunded, Slashed }

    struct Policy {
        bytes32 policyHash;
        uint256 w1;
        uint256 w2;
        uint256 w3;
        uint256 threshold;
    }

    struct Task {
        address requester;
        bytes32 codeCommitment;
        bytes32 inputCommitment;
        Policy policy;
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
    uint256 public protocolFees;
    
    IVerityVerifier public immutable verifier;
    address public disputeManager;

    event TaskStateChanged(uint256 indexed taskId, Status oldState, Status newState, address indexed actor);
    event TaskRequested(uint256 indexed taskId, address indexed requester, bytes32 codeHash, bytes32 inputHash, bytes32 policyHash, uint256 w1, uint256 w2, uint256 w3, uint256 threshold, uint256 bounty, uint64 deadline);
    event WorkerRegistered(address indexed worker, uint256 amount);
    event WorkerWithdrew(address indexed worker, uint256 amount);

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

    function withdrawStake(uint256 amount) external nonReentrant {
        if (workerStakes[msg.sender] < amount) revert InsufficientStake();
        workerStakes[msg.sender] -= amount;
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        if (!ok) revert TransferFailed();
        emit WorkerWithdrew(msg.sender, amount);
    }

    function requestComputation(
        bytes32 codeCommitment,
        bytes32 inputCommitment,
        bytes32 policyHash,
        uint256 w1,
        uint256 w2,
        uint256 w3,
        uint256 threshold,
        uint64 timeoutSec
    ) external payable returns (uint256) {
        require(msg.value > 0, "Bounty required");
        
        uint256 taskId = nextTaskId++;
        tasks[taskId] = Task({
            requester: msg.sender,
            codeCommitment: codeCommitment,
            inputCommitment: inputCommitment,
            policy: Policy({
                policyHash: policyHash,
                w1: w1,
                w2: w2,
                w3: w3,
                threshold: threshold
            }),
            bounty: msg.value,
            deadline: uint64(block.timestamp + timeoutSec),
            worker: address(0),
            outputCommitment: bytes32(0),
            challengeEnd: 0,
            status: Status.Requested
        });

        emit TaskRequested(taskId, msg.sender, codeCommitment, inputCommitment, policyHash, w1, w2, w3, threshold, msg.value, tasks[taskId].deadline);
        emit TaskStateChanged(taskId, Status.None, Status.Requested, msg.sender);
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
        if (signals[1] != uint256(outputCommitment)) revert PublicSignalsMismatch();
        if (signals[2] != uint256(task.policy.policyHash)) revert PublicSignalsMismatch();
        if (signals[3] != task.policy.w1) revert PublicSignalsMismatch();
        if (signals[4] != task.policy.w2) revert PublicSignalsMismatch();
        if (signals[5] != task.policy.w3) revert PublicSignalsMismatch();
        if (signals[6] != task.policy.threshold) revert PublicSignalsMismatch();
        
        // ZK Verification
        bool isValid = verifier.verifyProof(proof, signals);
        if (!isValid) revert InvalidProof(); 

        task.worker = msg.sender;
        task.outputCommitment = outputCommitment;
        task.status = Status.Submitted;
        task.challengeEnd = uint64(block.number + CHALLENGE_WINDOW_BLOCKS);

        emit TaskStateChanged(taskId, Status.Requested, Status.Submitted, msg.sender);
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

        emit TaskStateChanged(taskId, Status.Submitted, Status.Finalized, msg.sender);
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

        emit TaskStateChanged(taskId, Status.Requested, Status.Refunded, msg.sender);
    }

    function slashWorker(address worker, uint256 amount) external onlyDisputeManager {
        if (workerStakes[worker] >= amount) {
            workerStakes[worker] -= amount;
        } else {
            workerStakes[worker] = 0;
        }
    }

    function setTaskStatus(uint256 taskId, Status newStatus) external onlyDisputeManager {
        emit TaskStateChanged(taskId, tasks[taskId].status, newStatus, msg.sender);
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

    function addProtocolFee(uint256 amount) external onlyDisputeManager {
        protocolFees += amount;
    }

    function getTask(uint256 taskId) external view returns (Task memory) {
        return tasks[taskId];
    }
}