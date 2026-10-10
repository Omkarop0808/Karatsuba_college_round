const { buildPoseidon } = require("circomlibjs");

async function run() {
    const poseidon = await buildPoseidon();
    const hash = poseidon([1, 2, 3, 4]);
    console.log(poseidon.F.toString(hash));
}
run();
