import { TestRunner, DryRunOptions, MutantRunOptions, MutantRunResult, DryRunResult, TestRunnerCapabilities } from '@stryker-mutator/api/test-runner';
import { ResourceDecorator } from '../concurrent/index.js';
export declare class TestRunnerDecorator extends ResourceDecorator<TestRunner> {
    capabilities(): Promise<TestRunnerCapabilities>;
    dryRun(options: DryRunOptions): Promise<DryRunResult>;
    mutantRun(options: MutantRunOptions): Promise<MutantRunResult>;
}
//# sourceMappingURL=test-runner-decorator.d.ts.map