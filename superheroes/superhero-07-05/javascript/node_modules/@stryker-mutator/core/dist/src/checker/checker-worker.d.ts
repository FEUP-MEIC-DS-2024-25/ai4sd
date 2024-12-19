import { CheckResult } from '@stryker-mutator/api/check';
import { StrykerOptions, Mutant } from '@stryker-mutator/api/core';
import { PluginCreator } from '../di/index.js';
import { CheckerResource } from './checker-resource.js';
export declare class CheckerWorker implements CheckerResource {
    private readonly innerCheckers;
    static inject: ["options", "pluginCreator"];
    constructor(options: StrykerOptions, pluginCreator: PluginCreator);
    init(): Promise<void>;
    check(checkerName: string, mutants: Mutant[]): Promise<Record<string, CheckResult>>;
    group(checkerName: string, mutants: Mutant[]): Promise<string[][]>;
    private perform;
}
//# sourceMappingURL=checker-worker.d.ts.map