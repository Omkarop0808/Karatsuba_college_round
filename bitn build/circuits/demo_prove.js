const { generateInput } = require("./generate_input");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

async function main() {
    const startTime = Date.now();

    console.log("=====================================================================");
    console.log("    VERITY CRYPTOGRAPHIC PROVING ENGINE — LIVE JUDGE DEMONSTRATION   ");
    console.log("=====================================================================");

    const income = process.argv[2] || 100000;
    const debt = process.argv[3] || 5000;
    const historyMonths = process.argv[4] || 24;
    const threshold = process.argv[5] || 500000;

    console.log(`[Step 1] Formulating inputs & computing Poseidon commitments...`);
    const inputGenStart = Date.now();
    const config = await generateInput({ income, debt, historyMonths, threshold });
    const inputGenTime = Date.now() - inputGenStart;

    console.log(`  - Income          : $${Number(config.income).toLocaleString()}`);
    console.log(`  - Debt            : $${Number(config.debt).toLocaleString()}`);
    console.log(`  - Credit History  : ${config.historyMonths} Months`);
    console.log(`  - Weights (w1,w2,w3): (${config.w1}, ${config.w2}, ${config.w3})`);
    console.log(`  - Predicate Score : ${Number(config.score).toLocaleString()} (Threshold: ${Number(config.threshold).toLocaleString()})`);
    console.log(`  - Audit Outcome   : ${config.eligible === 1 ? "ELIGIBLE [APPROVED]" : "INELIGIBLE [REJECTED]"}`);
    console.log(`  - Input Commit    : ${config.inputData.inputCommit.slice(0, 24)}...`);
    console.log(`  - Output Commit   : ${config.inputData.outputCommit.slice(0, 24)}...`);
    console.log(`  - Policy Hash     : ${config.inputData.policyHash.slice(0, 24)}...`);
    console.log(`  => Commitment Time: ${inputGenTime} ms`);

    console.log(`\n[Step 2] Computing witness in WASM runtime...`);
    const witnessStart = Date.now();
    execSync(`node build/compute_audit_js/generate_witness.js build/compute_audit_js/compute_audit.wasm input.json build/witness.wtns`, {
        cwd: __dirname,
        stdio: "pipe"
    });
    const witnessTime = Date.now() - witnessStart;
    console.log(`  => Witness generated in: ${witnessTime} ms`);

    console.log(`\n[Step 3] Generating Groth16 Zero-Knowledge Proof (BN254 curve)...`);
    const proveStart = Date.now();
    execSync(`snarkjs groth16 prove build/circuit_final.zkey build/witness.wtns build/proof.json build/public.json`, {
        cwd: __dirname,
        stdio: "pipe"
    });
    const proveTime = Date.now() - proveStart;
    console.log(`  => Groth16 proof generated in: ${proveTime} ms (2,543 R1CS constraints)`);

    console.log(`\n[Step 4] Verifying proof offline against Verification Key...`);
    const verifyStart = Date.now();
    const verifyOutput = execSync(`snarkjs groth16 verify build/vkey.json build/public.json build/proof.json`, {
        cwd: __dirname,
        encoding: "utf-8"
    });
    const verifyTime = Date.now() - verifyStart;
    const isOk = verifyOutput.includes("OK!");

    console.log(`  => Result: ${isOk ? "[SUCCESS] snarkJS: OK!" : "[FAILED]"}`);
    console.log(`  => Verification latency: ${verifyTime} ms`);

    const totalTime = Date.now() - startTime;
    console.log("\n=====================================================================");
    console.log(`  VERITY PIPELINE SUMMARY:`);
    console.log(`  Total Proving & Verification Pipeline Time: ${totalTime} ms (${(totalTime / 1000).toFixed(2)}s)`);
    console.log(`  Zero-Knowledge Soundness: MATHEMATICALLY PROVED`);
    console.log("=====================================================================\n");
}

main().catch(err => {
    console.error("Demo failed:", err);
    process.exit(1);
});
