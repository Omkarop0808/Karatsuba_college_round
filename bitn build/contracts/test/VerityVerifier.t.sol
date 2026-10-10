// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import "../src/Groth16Verifier.sol";
import "../src/VerityVerifier.sol";
import "../src/IVerityVerifier.sol";

contract VerityVerifierTest is Test {
    Groth16Verifier public groth16Verifier;
    VerityVerifier public verityVerifier;

    function setUp() public {
        groth16Verifier = new Groth16Verifier();
        verityVerifier = new VerityVerifier(address(groth16Verifier));
    }

    function test_VerifyValidProof() public view {
        IVerityVerifier.ProofPoints memory proof;
        proof.a = [
            uint256(0x17bdf29a9d40677f699c3f76489bf29526b09530680dd537b849daa80085110c),
            uint256(0x01b6c27aa20d7024a103726cef9c688bde31161e809671254bcb7dfa4ad2bb85)
        ];
        proof.b = [
            [
                uint256(0x1ebccac103edc73b91c43bbb59d2b39876950f3e2b6ba99f2de6cc94250132e5),
                uint256(0x233e6e24b2b6351ed6a9c1b94217d617f50c3bb2a4f0984598f1dc4e81beeeb8)
            ],
            [
                uint256(0x05ca835c97542ed11fd56923199cc52b8f424e424ab929af07b72ce1700f2905),
                uint256(0x2c7f88bf20d28ce3815818e6ce4dda5dfb2ce4f8060cf79a7672217135d81104)
            ]
        ];
        proof.c = [
            uint256(0x1d5083f36f5e7e99d3afdc72b025d7426d337e015f3d8d77f42e19f9aa661dae),
            uint256(0x2f3b0d083350401e7736c5a1e5073eb9e7da3aa105848e0d630622e335ac34b8)
        ];

        uint256[] memory signals = new uint256[](7);
        signals[0] = uint256(0x26026a2500231887c3f0f27b01bf2175c63697d8bb44ed66f30358427247c6fd);
        signals[1] = uint256(0x05321b005c62be8395e55022ff65bec139e35f676d5bde2b954092af7cd71c38);
        signals[2] = uint256(0x053234a55621bc43a5f402d79cc8a4db1391a1d5a39ff2cc8d360192c070e2bf);
        signals[3] = uint256(0x0a);
        signals[4] = uint256(0x05);
        signals[5] = uint256(0x02);
        signals[6] = uint256(0x07a120);

        bool result = verityVerifier.verifyProof(proof, signals);
        assertTrue(result, "VerityVerifier should verify valid proof");
    }

    function test_RevertInvalidSignalLength() public {
        IVerityVerifier.ProofPoints memory proof;
        uint256[] memory signals = new uint256[](6);

        vm.expectRevert(IVerityVerifier.PublicSignalsMismatch.selector);
        verityVerifier.verifyProof(proof, signals);
    }

    function test_RevertTamperedSignal() public {
        IVerityVerifier.ProofPoints memory proof;
        proof.a = [
            uint256(0x17bdf29a9d40677f699c3f76489bf29526b09530680dd537b849daa80085110c),
            uint256(0x01b6c27aa20d7024a103726cef9c688bde31161e809671254bcb7dfa4ad2bb85)
        ];
        proof.b = [
            [
                uint256(0x1ebccac103edc73b91c43bbb59d2b39876950f3e2b6ba99f2de6cc94250132e5),
                uint256(0x233e6e24b2b6351ed6a9c1b94217d617f50c3bb2a4f0984598f1dc4e81beeeb8)
            ],
            [
                uint256(0x05ca835c97542ed11fd56923199cc52b8f424e424ab929af07b72ce1700f2905),
                uint256(0x2c7f88bf20d28ce3815818e6ce4dda5dfb2ce4f8060cf79a7672217135d81104)
            ]
        ];
        proof.c = [
            uint256(0x1d5083f36f5e7e99d3afdc72b025d7426d337e015f3d8d77f42e19f9aa661dae),
            uint256(0x2f3b0d083350401e7736c5a1e5073eb9e7da3aa105848e0d630622e335ac34b8)
        ];

        uint256[] memory signals = new uint256[](7);
        signals[0] = uint256(0x26026a2500231887c3f0f27b01bf2175c63697d8bb44ed66f30358427247c6fd);
        signals[1] = uint256(0x05321b005c62be8395e55022ff65bec139e35f676d5bde2b954092af7cd71c38);
        signals[2] = uint256(0x053234a55621bc43a5f402d79cc8a4db1391a1d5a39ff2cc8d360192c070e2bf);
        signals[3] = uint256(0x0a);
        signals[4] = uint256(0x05);
        signals[5] = uint256(0x02);
        signals[6] = uint256(0x999999); // TAMPERED threshold!

        vm.expectRevert(IVerityVerifier.InvalidProof.selector);
        verityVerifier.verifyProof(proof, signals);
    }
}
