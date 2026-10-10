const { poseidonContract } = require("circomlibjs");
const fs = require("fs");
const path = require("path");

function main() {
    const abi = poseidonContract.generateABI(4);
    const bytecode = poseidonContract.createCode(4);
    fs.writeFileSync("PoseidonT5.json", JSON.stringify({ abi, bytecode: { object: bytecode } }, null, 2));
    
    // In order for Foundry to use it easily, we can write a simple wrapper contract 
    // or deploy it using `ethers` or `vm.etch` in Foundry tests.
    // However, the best way in Foundry without linking is to use a solidity wrapper if available,
    // or just return the bytecode so we can output it.
    console.log("Generated PoseidonT5.json with bytecode length:", bytecode.length);
}

main();
