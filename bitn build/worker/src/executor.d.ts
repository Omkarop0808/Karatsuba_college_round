export declare function executeAndCommit(inputs: {
    income: bigint;
    debt: bigint;
    historyMonths: bigint;
    salt: bigint;
    w1: bigint;
    w2: bigint;
    w3: bigint;
    threshold: bigint;
}): Promise<{
    score: bigint;
    isEligible: bigint;
    outputCommitment: string;
}>;
//# sourceMappingURL=executor.d.ts.map