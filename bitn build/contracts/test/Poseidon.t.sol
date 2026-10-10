// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import "../src/PoseidonT5.sol";

contract PoseidonDeployer {
    function deploy() public returns (address) {
        bytes memory bytecode = PoseidonT5Bytecode.getBytecode();
        address deployedAddress;
        assembly {
            deployedAddress := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        require(deployedAddress != address(0), "Deploy failed");
        return deployedAddress;
    }
}

contract PoseidonTest is Test {
    IPoseidonT5 public poseidon;

    function setUp() public {
        PoseidonDeployer deployer = new PoseidonDeployer();
        poseidon = IPoseidonT5(deployer.deploy());
    }

    function test_PoseidonHash() public {
        uint256[4] memory input = [uint256(1), uint256(2), uint256(3), uint256(4)];
        uint256 result = poseidon.poseidon(input);
        
        // This is a known poseidon(1, 2, 3, 4) from circomlibjs
        uint256 expected = 18821383157269793795438455681495246036402687001665670618754263018637548127333;
        assertEq(result, expected);
    }
}
