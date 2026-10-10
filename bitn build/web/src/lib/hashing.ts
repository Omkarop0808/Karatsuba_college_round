import { keccak256, encodePacked } from 'viem';

export function computeInputCommitment(income: bigint, debt: bigint, historyMonths: bigint, salt: bigint): `0x${string}` {
    // For front-end matching our protocol, we mimic the Poseidon hashing representation or fallback to Keccak256
    // Since circomlibjs is tricky in pure browser bundles without WASM loading, we use viem's keccak256 
    // to provide the deterministic preview hash for the hackathon UI.
    return keccak256(encodePacked(
        ['uint256', 'uint256', 'uint256', 'uint256'],
        [income, debt, historyMonths, salt]
    ));
}

export function computeOutputCommitment(score: bigint, isEligible: bigint, salt: bigint): `0x${string}` {
    return keccak256(encodePacked(
        ['uint256', 'uint256', 'uint256'],
        [score, isEligible, salt]
    ));
}
