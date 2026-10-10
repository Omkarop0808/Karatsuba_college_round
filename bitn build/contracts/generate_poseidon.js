const { poseidonContract } = require("circomlibjs");
const fs = require("fs");

function main() {
    const abi = poseidonContract.generateABI(4);
    const bytecode = poseidonContract.createCode(4);

    console.log("Bytecode length:", bytecode.length);
    fs.writeFileSync("Poseidon4.json", JSON.stringify({ abi, bytecode }));
}

main();
