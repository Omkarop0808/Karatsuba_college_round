import path from "path";
import { buildPoseidon } from "circomlibjs";

export interface ProofPoints {
    a: [bigint, bigint];
    b: [[bigint, bigint], [bigint, bigint]];
    c: [bigint, bigint];
}

export async function generateProof(inputs: {
    income: bigint | number | string;
    debt: bigint | number | string;
    historyMonths: bigint | number | string;
    salt: bigint | number | string;
    w1: bigint | number | string;
    w2: bigint | number | string;
    w3: bigint | number | string;
    threshold: bigint | number | string;
    inputCommit?: string;
    outputCommit?: string;
    policyHash?: string;
}): Promise<{
    proofPoints: ProofPoints;
    publicSignals: bigint[];
    inputCommitment: `0x${string}`;
    outputCommitment: `0x${string}`;
    policyHash: `0x${string}`;
}> {
    const snarkjs = require("snarkjs");
    const poseidon = await buildPoseidon();
    const F = poseidon.F;

    const inc = BigInt(inputs.income);
    const dbt = BigInt(inputs.debt);
    const hist = BigInt(inputs.historyMonths);
    const slt = BigInt(inputs.salt);
    const w1 = BigInt(inputs.w1);
    const w2 = BigInt(inputs.w2);
    const w3 = BigInt(inputs.w3);
    const thresh = BigInt(inputs.threshold);

    // Compute Poseidon commitments if not passed
    const inputCommitBig = inputs.inputCommit 
        ? BigInt(inputs.inputCommit)
        : F.toObject(poseidon([inc, dbt, hist, slt]));

    const policyHashBig = inputs.policyHash
        ? BigInt(inputs.policyHash)
        : F.toObject(poseidon([w1, w2, w3, thresh]));

    const positiveScore = (w1 * inc) + (w3 * hist);
    const negativeScore = w2 * dbt;
    if (positiveScore < negativeScore) {
        throw new Error("Score underflow in prover");
    }
    const score = positiveScore - negativeScore;
    const isEligible = score >= thresh ? 1n : 0n;

    const outputCommitBig = inputs.outputCommit
        ? BigInt(inputs.outputCommit)
        : F.toObject(poseidon([score, isEligible, slt]));

    const circuitInputs = {
        income: inc.toString(),
        debt: dbt.toString(),
        historyMonths: hist.toString(),
        salt: slt.toString(),
        w1: w1.toString(),
        w2: w2.toString(),
        w3: w3.toString(),
        threshold: thresh.toString(),
        inputCommit: inputCommitBig.toString(),
        outputCommit: outputCommitBig.toString(),
        policyHash: policyHashBig.toString()
    };

    const wasmPath = path.resolve(__dirname, "../../circuits/build/compute_audit_js/compute_audit.wasm");
    const zkeyPath = path.resolve(__dirname, "../../circuits/build/circuit_final.zkey");

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        circuitInputs,
        wasmPath,
        zkeyPath
    );

    // Format proof for Solidity as strict tuple types
    const proofPoints: ProofPoints = {
        a: [BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1])],
        b: [
            [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
            [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])]
        ],
        c: [BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])]
    };

    const formattedSignals = publicSignals.map((s: string) => BigInt(s));

    return { 
        proofPoints, 
        publicSignals: formattedSignals,
        inputCommitment: ("0x" + inputCommitBig.toString(16).padStart(64, '0')) as `0x${string}`,
        outputCommitment: ("0x" + outputCommitBig.toString(16).padStart(64, '0')) as `0x${string}`,
        policyHash: ("0x" + policyHashBig.toString(16).padStart(64, '0')) as `0x${string}`
    };
}
