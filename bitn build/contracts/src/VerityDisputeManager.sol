// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./VerityRegistry.sol";
import "./PoseidonT5.sol";

contract VerityDisputeManager is ReentrancyGuard {
    uint256 public constant CHALLENGE_BOND = 0.02 ether;
    uint256 public constant REVEAL_WINDOW_BLOCKS = 50;
    
    VerityRegistry public immutable registry;
    IPoseidonT5 public immutable poseidon;

    struct Challenge {
        address challenger;
        uint256 bond;
        uint256 revealDeadline;
    }

    mapping(uint256 => Challenge) public challenges;

    event TaskChallenged(uint256 indexed taskId, address indexed challenger);
    event ChallengerSlashed(uint256 indexed taskId, address indexed challenger);
    event WorkerSlashed(uint256 indexed taskId, address indexed worker);

    error BadStatus();
    error WindowClosed();
    error WindowOpen();
    error NotChallenged();
    error InvalidReveal();
    error IncorrectBond();

    constructor(address payable _registry, address _poseidon) {
        registry = VerityRegistry(_registry);
        poseidon = IPoseidonT5(_poseidon);
    }

    function challengeResult(uint256 taskId) external payable {
        if (msg.value != CHALLENGE_BOND) revert IncorrectBond();

        VerityRegistry.Task memory task = registry.getTask(taskId);
        
        if (task.status != VerityRegistry.Status.Submitted) revert BadStatus();
        if (block.number > task.challengeEnd) revert WindowClosed();

        challenges[taskId] = Challenge({
            challenger: msg.sender,
            bond: msg.value,
            revealDeadline: block.number + REVEAL_WINDOW_BLOCKS
        });

        registry.setTaskStatus(taskId, VerityRegistry.Status.Challenged);
        emit TaskChallenged(taskId, msg.sender);
    }

    function revealInput(uint256 taskId, bytes calldata preimage) external nonReentrant {
        VerityRegistry.Task memory task = registry.getTask(taskId);
        if (task.status != VerityRegistry.Status.Challenged) revert NotChallenged();

        Challenge memory c = challenges[taskId];
        if (block.number > c.revealDeadline) revert WindowClosed();

        uint256[4] memory inputs = abi.decode(preimage, (uint256[4]));
        if (bytes32(poseidon.poseidon(inputs)) != task.inputCommitment) revert InvalidReveal();

        delete challenges[taskId];

        // Status to Finalized
        registry.setTaskStatus(taskId, VerityRegistry.Status.Finalized);
        
        VerityRegistry.Task memory taskAfter = registry.getTask(taskId);
        registry.zeroTaskBounty(taskId);

        // Challenger bond is forfeited, worker gets normal payout + bond
        registry.payout(taskAfter.worker, taskAfter.bounty + c.bond);

        emit ChallengerSlashed(taskId, c.challenger);
    }

    function resolveChallenge(uint256 taskId) external nonReentrant {
        VerityRegistry.Task memory task = registry.getTask(taskId);
        if (task.status != VerityRegistry.Status.Challenged) revert NotChallenged();

        Challenge memory c = challenges[taskId];
        if (block.number <= c.revealDeadline) revert WindowOpen();

        delete challenges[taskId];

        registry.setTaskStatus(taskId, VerityRegistry.Status.Slashed);
        registry.zeroTaskBounty(taskId);

        // Slash worker 50% to challenger
        uint256 workerStake = registry.workerStakes(task.worker);
        uint256 slashAmount = registry.MIN_WORKER_STAKE();
        if (workerStake < slashAmount) slashAmount = workerStake;
        
        registry.slashWorker(task.worker, slashAmount);

        // Refund challenger bond + 50% of slashed stake
        uint256 reward = c.bond + (slashAmount / 2);
        registry.payout(c.challenger, reward);
        registry.addProtocolFee(slashAmount - (slashAmount / 2));
        
        // Refund requester
        if (task.bounty > 0) {
            registry.payout(task.requester, task.bounty);
        }

        emit WorkerSlashed(taskId, task.worker);
    }
}