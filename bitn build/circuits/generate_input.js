const { buildPoseidon } = require("circomlibjs");
const fs = require("fs");
const path = require("path");

async function generateInput(customArgs = {}) {
    const poseidon = await buildPoseidon();
    const F = poseidon.F;

    // Parse CLI arguments or use defaults
    const income = Number(customArgs.income ?? process.argv[2] ?? 100000);
    const debt = Number(customArgs.debt ?? process.argv[3] ?? 5000);
    const historyMonths = Number(customArgs.historyMonths ?? process.argv[4] ?? 24);
    const threshold = Number(customArgs.threshold ?? process.argv[5] ?? 500000);
    const w1 = Number(customArgs.w1 ?? process.argv[6] ?? 10);
    const w2 = Number(customArgs.w2 ?? process.argv[7] ?? 5);
    const w3 = Number(customArgs.w3 ?? process.argv[8] ?? 2);
    const salt = Number(customArgs.salt ?? 123456789);

    // Hashes via Poseidon
    const inputCommit = F.toObject(poseidon([income, debt, historyMonths, salt]));
    const policyHash = F.toObject(poseidon([w1, w2, w3, threshold]));

    // Output computation
    const score = (w1 * income) + (w3 * historyMonths) - (w2 * debt);
    const eligible = score >= threshold ? 1 : 0;

    const outputCommit = F.toObject(poseidon([score, eligible, salt]));

    const inputData = {
        income: income.toString(),
        debt: debt.toString(),
        historyMonths: historyMonths.toString(),
        salt: salt.toString(),
        w1: w1.toString(),
        w2: w2.toString(),
        w3: w3.toString(),
        threshold: threshold.toString(),
        inputCommit: inputCommit.toString(),
        outputCommit: outputCommit.toString(),
        policyHash: policyHash.toString()
    };

    const targetPath = path.join(__dirname, "input.json");
    fs.writeFileSync(targetPath, JSON.stringify(inputData, null, 2));

    return {
        inputData,
        score,
        eligible,
        income,
        debt,
        historyMonths,
        threshold,
        w1,
        w2,
        w3
    };
}

if (require.main === module) {
    generateInput().then((res) => {
        console.log(`[Verity Input Generator] Successfully generated input.json:`);
        console.log(`  Income: ${res.income}, Debt: ${res.debt}, History: ${res.historyMonths} months`);
        console.log(`  Weights: w1=${res.w1}, w2=${res.w2}, w3=${res.w3}`);
        console.log(`  Calculated Score: ${res.score} (Threshold: ${res.threshold}) => Eligible: ${res.eligible === 1}`);
        console.log(`  Input Commitment:  ${res.inputData.inputCommit}`);
        console.log(`  Output Commitment: ${res.inputData.outputCommit}`);
        console.log(`  Policy Hash:       ${res.inputData.policyHash}`);
    }).catch(console.error);
}

module.exports = { generateInput };