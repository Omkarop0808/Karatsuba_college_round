"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const chains_1 = require("viem/chains");
const dotenv = __importStar(require("dotenv"));
const executor_1 = require("./executor");
const prover_1 = require("./prover");
dotenv.config();
const privateKey = (process.env.PRIVATE_KEY || '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d');
const registryAddress = (process.env.REGISTRY_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0');
const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';
const account = (0, accounts_1.privateKeyToAccount)(privateKey);
const publicClient = (0, viem_1.createPublicClient)({
    chain: chains_1.localhost,
    transport: (0, viem_1.http)(rpcUrl)
});
const walletClient = (0, viem_1.createWalletClient)({
    account,
    chain: chains_1.localhost,
    transport: (0, viem_1.http)(rpcUrl)
});
const taskRequestedAbi = (0, viem_1.parseAbiItem)('event TaskRequested(uint256 indexed taskId, address indexed requester, bytes32 codeHash, bytes32 inputHash, uint256 bounty, uint64 deadline)');
const submitResultAbi = (0, viem_1.parseAbiItem)('function submitResult(uint256 taskId, bytes32 outputCommitment, (uint256[2] a, uint256[2][2] b, uint256[2] c) proof, uint256[] signals)');
const registerWorkerAbi = (0, viem_1.parseAbiItem)('function registerWorker() payable');
// Hackathon static inputs
const HACKATHON_STATIC_INPUTS = {
    income: 100000n,
    debt: 5000n,
    historyMonths: 24n,
    salt: 123456789n,
    w1: 10n,
    w2: 5n,
    w3: 2n,
    threshold: 500000n
};
async function main() {
    console.log(`[Worker] Started. Address: ${account.address}`);
    try {
        // Auto-register
        console.log(`[Worker] Registering worker with 0.05 ETH stake...`);
        const txInit = await walletClient.writeContract({
            account,
            address: registryAddress,
            abi: [registerWorkerAbi],
            functionName: 'registerWorker',
            value: 50000000000000000n,
            chain: chains_1.localhost
        });
        console.log(`[Worker] Registered! Tx: ${txInit}`);
    }
    catch (e) {
        console.log(`[Worker] Registration notice (may already be registered): ${e?.message?.slice(0, 80) || e}`);
    }
    console.log(`[Worker] Listening for TaskRequested events on ${registryAddress}...`);
    publicClient.watchEvent({
        address: registryAddress,
        event: taskRequestedAbi,
        onLogs: async (logs) => {
            for (const log of logs) {
                const { taskId, inputHash } = log.args;
                console.log(`\n[Worker] ⚡ Received Task! ID: ${taskId}, Input Hash: ${inputHash}`);
                try {
                    console.time("Proof Generation");
                    const { outputCommitment } = await (0, executor_1.executeAndCommit)(HACKATHON_STATIC_INPUTS);
                    console.log(`[Worker] Computed Output Commitment: ${outputCommitment}`);
                    // Generate Proof
                    const { proofPoints, publicSignals } = await (0, prover_1.generateProof)(HACKATHON_STATIC_INPUTS);
                    console.timeEnd("Proof Generation");
                    console.log(`[Worker] Over-the-wire Proof Generated. Submitting to Registry...`);
                    const { request } = await publicClient.simulateContract({
                        account,
                        address: registryAddress,
                        abi: [submitResultAbi],
                        functionName: 'submitResult',
                        args: [
                            taskId,
                            outputCommitment,
                            proofPoints,
                            publicSignals
                        ]
                    });
                    const hash = await walletClient.writeContract(request);
                    console.log(`[Worker] ✅ Result Submitted on-chain! Tx: ${hash}`);
                }
                catch (e) {
                    console.error(`[Worker] Failed task ${taskId}:`, e);
                }
            }
        }
    });
}
main().catch(console.error);
