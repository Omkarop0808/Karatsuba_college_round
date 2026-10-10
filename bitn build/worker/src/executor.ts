import { buildPoseidon } from 'circomlibjs';

export async function executeAndCommit(inputs: {
    income: bigint;
    debt: bigint;
    historyMonths: bigint;
    salt: bigint;
    w1: bigint;
    w2: bigint;
    w3: bigint;
    threshold: bigint;
}) {
    const poseidon = await buildPoseidon();
    const F = poseidon.F;

    const positiveScore = (inputs.w1 * inputs.income) + (inputs.w3 * inputs.historyMonths);
    const negativeScore = inputs.w2 * inputs.debt;
    
    if (positiveScore < negativeScore) {
        throw new Error("Score underflow");
    }

    const score = positiveScore - negativeScore;
    const isEligible = score >= inputs.threshold ? 1n : 0n;

    const outputCommitmentInt = F.toObject(poseidon([score, isEligible, inputs.salt]));
    const outputCommitment = "0x" + outputCommitmentInt.toString(16).padStart(64, '0');

    return {
        score,
        isEligible,
        outputCommitment
    };
}
