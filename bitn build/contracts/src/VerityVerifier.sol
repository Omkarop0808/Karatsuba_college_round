// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./IVerityVerifier.sol";

contract VerityVerifier is IVerityVerifier {
    address public immutable groth16Verifier;

    constructor(address _groth16Verifier) {
        groth16Verifier = _groth16Verifier;
    }

    function verifyProof(ProofPoints calldata proof, uint256[] calldata signals) external view override returns (bool) {
        if (signals.length != 7) {
            revert PublicSignalsMismatch();
        }

        uint256[7] memory fixedSignals;
        for (uint256 i = 0; i < 7; i++) {
            fixedSignals[i] = signals[i];
        }

        (bool success, bytes memory retData) = groth16Verifier.staticcall(
            abi.encodeWithSignature(
                "verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[7])",
                proof.a,
                proof.b,
                proof.c,
                fixedSignals
            )
        );

        if (!success) {
            revert InvalidProof();
        }

        bool isValid = abi.decode(retData, (bool));
        if (!isValid) {
            revert InvalidProof();
        }

        return true;
    }
}