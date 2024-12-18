import { DryRunResult, DryRunOptions, MutantRunOptions, MutantRunResult } from '@stryker-mutator/api/test-runner';
import { TestRunnerDecorator } from './test-runner-decorator.js';
/**
 * Wraps a test runner and implements the timeout functionality.
 */
export declare class TimeoutDecorator extends TestRunnerDecorator {
    private readonly log;
    dryRun(options: DryRunOptions): Promise<DryRunResult>;
    mutantRun(options: MutantRunOptions): Promise<MutantRunResult>;
    private run;
    private handleTimeout;
}
//# sourceMappingURL=timeout-decorator.d.ts.map