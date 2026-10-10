// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import "../src/VerityRegistry.sol";
import "../src/VerityDisputeManager.sol";
import "../src/VerityVerifier.sol";
import "../src/PoseidonT5.sol";

// Mock Groth16 Verifier
contract MockGroth16Verifier {
    bool public shouldPass = true;
    function setPass(bool _pass) external { shouldPass = _pass; }
    function verifyProof(uint256[2] memory, uint256[2][2] memory, uint256[2] memory, uint256[7] memory) public view returns (bool) {
        return shouldPass;
    }
}

contract VerityTest is Test {
    VerityRegistry registry;
    VerityDisputeManager disputeManager;
    VerityVerifier verifier;
    MockGroth16Verifier mockGroth;
    IPoseidonT5 poseidon;

    address requester = address(1);
    address worker = address(2);
    address challenger = address(3);

    bytes32 codeCommitment = keccak256("code");
    bytes32 inputCommitment = keccak256("input");
    bytes32 outputHash = keccak256("output");

    function setUp() public {
        vm.deal(requester, 10 ether);
        vm.deal(worker, 10 ether);
        vm.deal(challenger, 10 ether);

        mockGroth = new MockGroth16Verifier();
        verifier = new VerityVerifier(address(mockGroth));
        registry = new VerityRegistry(address(verifier));

        bytes memory bytecode = PoseidonT5Bytecode.getBytecode();
        address poseidonAddr;
        assembly {
            poseidonAddr := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        poseidon = IPoseidonT5(poseidonAddr);

        disputeManager = new VerityDisputeManager(payable(address(registry)), poseidonAddr);
        
        registry.setDisputeManager(address(disputeManager));
    }

    function test_HappyPath() public {
        // Register worker
        vm.prank(worker);
        registry.registerWorker{value: 0.05 ether}();

        // Request computation
        vm.prank(requester);
        uint256 taskId = registry.requestComputation{value: 1 ether}(codeCommitment, inputCommitment, bytes32(0), 10, 5, 20, 100, 100);

        // Submit result
        uint256[] memory signals = new uint256[](7);
        signals[0] = uint256(inputCommitment);
        signals[1] = uint256(outputHash);
        signals[2] = 0; // policyHash
        signals[3] = 10; // w1
        signals[4] = 5; // w2
        signals[5] = 20; // w3
        signals[6] = 100; // threshold
        IVerityVerifier.ProofPoints memory points;

        vm.prank(worker);
        registry.submitResult(taskId, outputHash, points, signals);

        VerityRegistry.Task memory task = registry.getTask(taskId);
        assertEq(uint(task.status), uint(VerityRegistry.Status.Submitted));

        task = registry.getTask(taskId);
        vm.roll(task.challengeEnd + 1);
        registry.finalizeTask(taskId);

        VerityRegistry.Task memory finalTask = registry.getTask(taskId);
        assertEq(uint(finalTask.status), uint(VerityRegistry.Status.Finalized));
    }

    function test_RevertInvalidProof() public {
        mockGroth.setPass(false); // Make proof fail

        vm.prank(worker);
        registry.registerWorker{value: 0.05 ether}();

        vm.prank(requester);
        uint256 taskId = registry.requestComputation{value: 1 ether}(codeCommitment, inputCommitment, bytes32(0), 10, 5, 20, 100, 100);

        uint256[] memory signals = new uint256[](7);
        signals[0] = uint256(inputCommitment);
        signals[1] = uint256(outputHash);
        signals[2] = 0; // policyHash
        signals[3] = 10; // w1
        signals[4] = 5; // w2
        signals[5] = 20; // w3
        signals[6] = 100; // threshold
        IVerityVerifier.ProofPoints memory points;

        vm.prank(worker);
        vm.expectRevert(IVerityVerifier.InvalidProof.selector);
        registry.submitResult(taskId, outputHash, points, signals);
    }

    function test_RevertBitFlip() public {
        vm.prank(worker);
        registry.registerWorker{value: 0.05 ether}();

        vm.prank(requester);
        uint256 taskId = registry.requestComputation{value: 1 ether}(codeCommitment, inputCommitment, bytes32(0), 10, 5, 20, 100, 100);

        uint256[] memory signals = new uint256[](7);
        signals[0] = uint256(inputCommitment);
        signals[1] = uint256(keccak256("different")); // signals[1] != outputCommitment
        IVerityVerifier.ProofPoints memory points;

        vm.prank(worker);
        vm.expectRevert(VerityRegistry.PublicSignalsMismatch.selector);
        registry.submitResult(taskId, outputHash, points, signals);
    }

    function test_RevertChangedThreshold() public {
        vm.prank(worker);
        registry.registerWorker{value: 0.05 ether}();

        vm.prank(requester);
        uint256 taskId = registry.requestComputation{value: 1 ether}(codeCommitment, inputCommitment, bytes32(0), 10, 5, 20, 100, 100);

        uint256[] memory signals = new uint256[](7);
        signals[0] = uint256(inputCommitment);
        signals[1] = uint256(outputHash);
        signals[2] = 0;
        signals[3] = 10;
        signals[4] = 5;
        signals[5] = 20;
        signals[6] = 200; // different threshold!
        IVerityVerifier.ProofPoints memory points;

        vm.prank(worker);
        vm.expectRevert(VerityRegistry.PublicSignalsMismatch.selector);
        registry.submitResult(taskId, outputHash, points, signals);
    }

    function test_ChallengeDefeated() public {
        vm.prank(worker);
        registry.registerWorker{value: 0.05 ether}();

        uint256[4] memory originalInputs = [uint256(1), uint256(2), uint256(3), uint256(4)];
        bytes32 realInputCommit = bytes32(poseidon.poseidon(originalInputs));

        vm.prank(requester);
        uint256 taskId = registry.requestComputation{value: 1 ether}(codeCommitment, realInputCommit, bytes32(0), 10, 5, 20, 100, 100);

        uint256[] memory signals = new uint256[](7);
        signals[0] = uint256(realInputCommit);
        signals[1] = uint256(outputHash);
        signals[2] = 0; // policyHash
        signals[3] = 10; // w1
        signals[4] = 5; // w2
        signals[5] = 20; // w3
        signals[6] = 100; // threshold
        IVerityVerifier.ProofPoints memory points;

        vm.prank(worker);
        registry.submitResult(taskId, outputHash, points, signals);

        // Challenge
        vm.prank(challenger);
        disputeManager.challengeResult{value: 0.02 ether}(taskId);

        // Worker reveals
        bytes memory preimage = abi.encode(originalInputs);
        
        uint256 workerBalBefore = worker.balance;
        
        vm.prank(worker);
        disputeManager.revealInput(taskId, preimage);

        VerityRegistry.Task memory task = registry.getTask(taskId);
        assertEq(uint(task.status), uint(VerityRegistry.Status.Finalized));
        
        uint256 workerBalAfter = worker.balance;
        // Worker should get bounty (1) + challenge bond (0.02)
        assertEq(workerBalAfter - workerBalBefore, 1.02 ether);
    }

    function test_ChallengeSucceeds() public {
        vm.prank(worker);
        registry.registerWorker{value: 0.05 ether}();

        uint256[4] memory originalInputs = [uint256(1), uint256(2), uint256(3), uint256(4)];
        bytes32 realInputCommit = bytes32(poseidon.poseidon(originalInputs));

        vm.prank(requester);
        uint256 taskId = registry.requestComputation{value: 1 ether}(codeCommitment, realInputCommit, bytes32(0), 10, 5, 20, 100, 100);

        uint256[] memory signals = new uint256[](7);
        signals[0] = uint256(realInputCommit);
        signals[1] = uint256(outputHash);
        signals[2] = 0; // policyHash
        signals[3] = 10; // w1
        signals[4] = 5; // w2
        signals[5] = 20; // w3
        signals[6] = 100; // threshold
        IVerityVerifier.ProofPoints memory points;

        vm.prank(worker);
        registry.submitResult(taskId, outputHash, points, signals);

        // Challenge
        vm.prank(challenger);
        disputeManager.challengeResult{value: 0.02 ether}(taskId);

        // Wait past reveal deadline
        vm.roll(block.number + 51);

        uint256 challengerBalBefore = challenger.balance;
        uint256 requesterBalBefore = requester.balance;
        uint256 workerStakeBefore = registry.workerStakes(worker);
        
        vm.prank(challenger);
        disputeManager.resolveChallenge(taskId);

        VerityRegistry.Task memory task = registry.getTask(taskId);
        assertEq(uint(task.status), uint(VerityRegistry.Status.Slashed));

        // Challenger gets back bond + 50% slash (0.05 / 2 = 0.025)
        assertEq(challenger.balance - challengerBalBefore, 0.045 ether);
        // Requester refunded bounty
        assertEq(requester.balance - requesterBalBefore, 1 ether);
        // Worker slashed
        assertEq(registry.workerStakes(worker), workerStakeBefore - 0.05 ether);
    }
}