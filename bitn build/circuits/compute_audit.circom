pragma circom 2.1.6;

include "node_modules/circomlib/circuits/poseidon.circom";
include "node_modules/circomlib/circuits/comparators.circom";
include "node_modules/circomlib/circuits/bitify.circom";

template ComputeAudit() {
    // Private Inputs
    signal input income;
    signal input debt;
    signal input historyMonths;
    signal input salt;

    // Public Inputs
    signal input inputCommit;
    signal input outputCommit;
    signal input policyHash;
    signal input w1;
    signal input w2;
    signal input w3;
    signal input threshold;

    // Range checks to prevent overflow/underflow (64-bit limits)
    component num2BitsIncome = Num2Bits(64);
    num2BitsIncome.in <== income;
    
    component num2BitsDebt = Num2Bits(64);
    num2BitsDebt.in <== debt;
    
    component num2BitsHistory = Num2Bits(64);
    num2BitsHistory.in <== historyMonths;

    // Verify input commitment
    component poseidonInput = Poseidon(4);
    poseidonInput.inputs[0] <== income;
    poseidonInput.inputs[1] <== debt;
    poseidonInput.inputs[2] <== historyMonths;
    poseidonInput.inputs[3] <== salt;
    inputCommit === poseidonInput.out;

    // Verify policy hash
    component poseidonPolicy = Poseidon(4);
    poseidonPolicy.inputs[0] <== w1;
    poseidonPolicy.inputs[1] <== w2;
    poseidonPolicy.inputs[2] <== w3;
    poseidonPolicy.inputs[3] <== threshold;
    policyHash === poseidonPolicy.out;

    // Calculate score
    signal w1_income <== w1 * income;
    signal w3_history <== w3 * historyMonths;
    signal positiveScore <== w1_income + w3_history;
    signal negativeScore <== w2 * debt;

    // Enforce positiveScore >= negativeScore to prevent field underflow
    component checkNonNegative = GreaterEqThan(128);
    checkNonNegative.in[0] <== positiveScore;
    checkNonNegative.in[1] <== negativeScore;
    checkNonNegative.out === 1;

    signal score <== positiveScore - negativeScore;

    // Check threshold eligibility
    component isEligible = GreaterEqThan(128);
    isEligible.in[0] <== score;
    isEligible.in[1] <== threshold;
    
    // Check output commitment
    component poseidonOutput = Poseidon(3);
    poseidonOutput.inputs[0] <== score;
    poseidonOutput.inputs[1] <== isEligible.out;
    poseidonOutput.inputs[2] <== salt;
    outputCommit === poseidonOutput.out;
}

// Instantiate main component
component main {public [inputCommit, outputCommit, policyHash, w1, w2, w3, threshold]} = ComputeAudit();