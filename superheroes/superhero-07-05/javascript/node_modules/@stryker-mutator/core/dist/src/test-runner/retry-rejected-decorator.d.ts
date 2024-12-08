import { DryRunResult, DryRunOptions, MutantRunResult, MutantRunOptions } from '@stryker-mutator/api/test-runner';
import { TestRunnerDecorator } from './test-runner-decorator.js';
export declare const MAX_RETRIES = 2;
/**
 * Implements the retry functionality whenever an internal test runner rejects a promise.
 */
export declare class RetryRejectedDecorator extends TestRunnerDecorator {
    private readonly log;
    dryRun(options: DryRunOptions): Promise<DryRunResult>;
    mutantRun(options: MutantRunOptions): Promise<MutantRunResult>;
    private run;
}
//# sourceMappingURL=retry-rejected-decorator.d.ts.map