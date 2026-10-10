import { createWalletClient, createPublicClient, http, parseAbiItem } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { localhost } from 'viem/chains';
import * as dotenv from 'dotenv';
import { executeAndCommit } from './executor';
import { generateProof } from './prover';

dotenv.config();

const privateKey = (process.env.PRIVATE_KEY || '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d') as `0x${string}`;
const registryAddress = (process.env.REGISTRY_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0') as `0x${string}`;
const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';

const account = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({
    chain: localhost,
    transport: http(rpcUrl)
});

const walletClient = createWalletClient({
    account,
    chain: localhost,
    transport: http(rpcUrl)
});

const taskRequestedAbi = parseAbiItem('event TaskRequested(uint256 indexed taskId, address indexed requester, bytes32 codeHash, bytes32 inputHash, uint256 bounty, uint64 deadline)');
const submitResultAbi = parseAbiItem('function submitResult(uint256 taskId, bytes32 outputCommitment, (uint256[2] a, uint256[2][2] b, uint256[2] c) proof, uint256[] signals)');
const registerWorkerAbi = parseAbiItem('function registerWorker() payable');

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
            chain: localhost
        });
        console.log(`[Worker] Registered! Tx: ${txInit}`);
    } catch (e: any) {
        console.log(`[Worker] Registration notice (may already be registered): ${e?.message?.slice(0, 80) || e}`);
    }

    console.log(`[Worker] Listening for TaskRequested events on ${registryAddress}...`);

    publicClient.watchEvent({
        address: registryAddress,
        event: taskRequestedAbi,
        onLogs: async logs => {
            for (const log of logs) {
                const { taskId, inputHash } = log.args;
                console.log(`\n[Worker] ⚡ Received Task! ID: ${taskId}, Input Hash: ${inputHash}`);
                
                try {
                    console.time("Proof Generation");
                    
                    const { outputCommitment } = await executeAndCommit(HACKATHON_STATIC_INPUTS);
                    console.log(`[Worker] Computed Output Commitment: ${outputCommitment}`);

                    // Generate Proof
                    const { proofPoints, publicSignals } = await generateProof(HACKATHON_STATIC_INPUTS);
                    console.timeEnd("Proof Generation");

                    console.log(`[Worker] Over-the-wire Proof Generated. Submitting to Registry...`);

                    const { request } = await publicClient.simulateContract({
                        account,
                        address: registryAddress,
                        abi: [submitResultAbi],
                        functionName: 'submitResult',
                        args: [
                            taskId!,
                            outputCommitment as `0x${string}`,
                            proofPoints,
                            publicSignals
                        ]
                    });

                    const hash = await walletClient.writeContract(request);
                    console.log(`[Worker] ✅ Result Submitted on-chain! Tx: ${hash}`);
                } catch (e) {
                    console.error(`[Worker] Failed task ${taskId}:`, e);
                }
            }
        }
    });
}

main().catch(console.error);
