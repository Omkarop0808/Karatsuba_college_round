// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import "../src/VerityRegistry.sol";
import "../src/VerityDisputeManager.sol";
import "../src/VerityVerifier.sol";

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
        disputeManager = new VerityDisputeManager(payable(address(registry)));
        
        registry.setDisputeManager(address(disputeManager));
    }

    function test_HappyPath() public {
        // Register worker
        vm.prank(worker);
        registry.registerWorker{value: 0.05 ether}();

        // Request computation
        vm.prank(requester);
        uint256 taskId = registry.requestComputation{value: 1 ether}(codeCommitment, inputCommitment, 100);

        // Submit result
        uint256[] memory signals = new uint256[](7);
        signals[0] = uint256(inputCommitment);
        signals[1] = uint256(outputHash);
        IVerityVerifier.ProofPoints memory points;

        vm.prank(worker);
        registry.submitResult(taskId, outputHash, points, signals);

        (, , , , , , , uint64 challengeEnd, VerityRegistry.Status status) = registry.tasks(taskId);
        assertEq(uint(status), uint(VerityRegistry.Status.Submitted));

        // Finalize task
        vm.roll(challengeEnd + 1);
        registry.finalizeTask(taskId);

        (, , , , , , , , VerityRegistry.Status finalStatus) = registry.tasks(taskId);
        assertEq(uint(finalStatus), uint(VerityRegistry.Status.Finalized));
    }

    function test_RevertInvalidProof() public {
        mockGroth.setPass(false); // Make proof fail

        vm.prank(worker);
        registry.registerWorker{value: 0.05 ether}();

        vm.prank(requester);
        uint256 taskId = registry.requestComputation{value: 1 ether}(codeCommitment, inputCommitment, 100);

        uint256[] memory signals = new uint256[](7);
        signals[0] = uint256(inputCommitment);
        signals[1] = uint256(outputHash);
        IVerityVerifier.ProofPoints memory points;

        vm.prank(worker);
        vm.expectRevert(IVerityVerifier.InvalidProof.selector);
        registry.submitResult(taskId, outputHash, points, signals);
    }

    function test_RevertBitFlip() public {
        vm.prank(worker);
        registry.registerWorker{value: 0.05 ether}();

        vm.prank(requester);
        uint256 taskId = registry.requestComputation{value: 1 ether}(codeCommitment, inputCommitment, 100);

        uint256[] memory signals = new uint256[](7);
        signals[0] = uint256(inputCommitment);
        signals[1] = uint256(keccak256("different")); // signals[1] != outputCommitment
        IVerityVerifier.ProofPoints memory points;

        vm.prank(worker);
        vm.expectRevert(VerityRegistry.PublicSignalsMismatch.selector);
        registry.submitResult(taskId, outputHash, points, signals);
    }
}