// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IVerityVerifier {
    struct ProofPoints {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
    }

    error InvalidProof();
    error PublicSignalsMismatch();

    function verifyProof(ProofPoints calldata proof, uint256[] calldata signals) external view returns (bool);
}