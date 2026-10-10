// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import "../src/VerityRegistry.sol";
import "../src/VerityDisputeManager.sol";
import "../src/VerityVerifier.sol";
import "../src/Groth16Verifier.sol";

contract DeployVerity is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Groth16Verifier groth = new Groth16Verifier();
        VerityVerifier verifier = new VerityVerifier(address(groth));
        VerityRegistry registry = new VerityRegistry(address(verifier));
        VerityDisputeManager disputeManager = new VerityDisputeManager(payable(address(registry)));
        
        registry.setDisputeManager(address(disputeManager));

        vm.stopBroadcast();

        console.log("Groth16Verifier:", address(groth));
        console.log("VerityVerifier:", address(verifier));
        console.log("VerityRegistry:", address(registry));
        console.log("VerityDisputeManager:", address(disputeManager));
    }
}