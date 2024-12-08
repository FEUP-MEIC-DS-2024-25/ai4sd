import { StrykerOptions } from '@stryker-mutator/api/core';
import { TestRunner, DryRunOptions, MutantRunOptions, MutantRunResult, DryRunResult, TestRunnerCapabilities } from '@stryker-mutator/api/test-runner';
import { PluginCreator } from '../di/index.js';
export declare class ChildProcessTestRunnerWorker implements TestRunner {
    private readonly underlyingTestRunner;
    static inject: ["options", "pluginCreator"];
    constructor({ testRunner }: StrykerOptions, pluginCreator: PluginCreator);
    capabilities(): Promise<TestRunnerCapabilities>;
    init(): Promise<void>;
    dispose(): Promise<void>;
    dryRun(options: DryRunOptions): Promise<DryRunResult>;
    mutantRun(options: MutantRunOptions): Promise<MutantRunResult>;
}
//# sourceMappingURL=child-process-test-runner-worker.d.ts.map