const fs = require('fs');
const data = JSON.parse(fs.readFileSync('PoseidonT5.json'));
const bytecode = data.bytecode.object.replace(/^0x/, '');

const sol = `// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

library PoseidonT5Bytecode {
    function getBytecode() internal pure returns (bytes memory) {
        return hex"${bytecode}";
    }
}

interface IPoseidonT5 {
    function poseidon(uint256[4] memory input) external pure returns (uint256);
}
`;

fs.writeFileSync('../contracts/src/PoseidonT5.sol', sol);
