"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeAndCommit = executeAndCommit;
const circomlibjs_1 = require("circomlibjs");
async function executeAndCommit(inputs) {
    const poseidon = await (0, circomlibjs_1.buildPoseidon)();
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
