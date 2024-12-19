import { DryRunOptions, DryRunResult, MutantRunOptions, MutantRunResult, TestRunnerCapabilities } from '@stryker-mutator/api/test-runner';
import { TestRunnerDecorator } from './test-runner-decorator.js';
export declare class ReloadEnvironmentDecorator extends TestRunnerDecorator {
    private _capabilities?;
    private testEnvironment;
    capabilities(): Promise<TestRunnerCapabilities>;
    dryRun(options: DryRunOptions): Promise<DryRunResult>;
    mutantRun(options: MutantRunOptions): Promise<MutantRunResult>;
    private testRunnerIsCapableOfReload;
}
//# sourceMappingURL=reload-environment-decorator.d.ts.map