export const REGISTRY_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
export const DISPUTE_MANAGER_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

export const REGISTRY_ABI = [
  "function requestComputation(bytes32 codeCommitment, bytes32 inputCommitment, uint64 timeoutSec) payable returns (uint256)",
  "function registerWorker() payable",
  "function submitResult(uint256 taskId, bytes32 outputCommitment, tuple(uint256[2] a, uint256[2][2] b, uint256[2] c) proof, uint256[] signals)",
  "function finalizeTask(uint256 taskId)",
  "function claimTimeoutRefund(uint256 taskId)",
  "function tasks(uint256) view returns (address requester, bytes32 codeCommitment, bytes32 inputCommitment, uint256 bounty, uint64 deadline, address worker, bytes32 outputCommitment, uint64 challengeEnd, uint8 status)",
  "event TaskRequested(uint256 indexed taskId, address indexed requester, bytes32 codeHash, bytes32 inputHash, uint256 bounty, uint64 deadline)",
  "event TaskSubmitted(uint256 indexed taskId, address indexed worker, bytes32 outputCommitment)",
  "event TaskFinalized(uint256 indexed taskId)"
];

export const DISPUTE_MANAGER_ABI = [
  "function challengeResult(uint256 taskId) payable",
  "function revealInput(uint256 taskId, bytes preimage)",
  "function resolveChallenge(uint256 taskId)",
  "event TaskChallenged(uint256 indexed taskId, address indexed challenger)",
  "event ChallengerSlashed(uint256 indexed taskId, address indexed challenger)",
  "event WorkerSlashed(uint256 indexed taskId, address indexed worker)"
];
