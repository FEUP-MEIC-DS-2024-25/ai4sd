import { MutantRunOptions, MutantRunResult, TestRunner } from '@stryker-mutator/api/test-runner';
import { StrykerOptions } from '@stryker-mutator/api/core';
import { TestRunnerDecorator } from './test-runner-decorator.js';
/**
 * Wraps a test runner and implements the retry functionality.
 */
export declare class MaxTestRunnerReuseDecorator extends TestRunnerDecorator {
    runs: number;
    private readonly restartAfter;
    constructor(testRunnerProducer: () => TestRunner, options: Pick<StrykerOptions, 'maxTestRunnerReuse'>);
    mutantRun(options: MutantRunOptions): Promise<MutantRunResult>;
    dispose(): Promise<any>;
}
//# sourceMappingURL=max-test-runner-reuse-decorator.d.ts.map