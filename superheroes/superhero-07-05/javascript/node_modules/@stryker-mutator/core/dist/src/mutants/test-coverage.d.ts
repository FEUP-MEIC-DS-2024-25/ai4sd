import { CoverageData } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { CompleteDryRunResult, TestResult } from '@stryker-mutator/api/test-runner';
export declare class TestCoverage {
    #private;
    constructor(testsByMutantId: Map<string, Set<TestResult>>, testsById: Map<string, TestResult>, staticCoverage: CoverageData | undefined, hitsByMutantId: Map<string, number>);
    get testsByMutantId(): ReadonlyMap<string, Set<TestResult>>;
    get testsById(): ReadonlyMap<string, TestResult>;
    get hitsByMutantId(): ReadonlyMap<string, number>;
    get hasCoverage(): boolean;
    hasStaticCoverage(mutantId: string): boolean;
    addTest(testResult: TestResult): void;
    addCoverage(mutantId: string, testIds: string[]): void;
    forMutant(mutantId: string): ReadonlySet<TestResult> | undefined;
    static from: typeof testCoverageFrom;
}
declare function testCoverageFrom({ tests, mutantCoverage }: CompleteDryRunResult, logger: Logger): TestCoverage;
declare namespace testCoverageFrom {
    var inject: readonly ["dryRunResult", "logger"];
}
export {};
//# sourceMappingURL=test-coverage.d.ts.map