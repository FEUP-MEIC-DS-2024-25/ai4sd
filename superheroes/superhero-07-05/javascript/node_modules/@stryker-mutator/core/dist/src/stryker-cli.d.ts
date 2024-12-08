import { Command } from 'commander';
import { MutantResult, PartialStrykerOptions } from '@stryker-mutator/api/core';
export declare class StrykerCli {
    private readonly argv;
    private readonly program;
    private readonly runMutationTest;
    private command;
    private strykerConfig;
    constructor(argv: string[], program?: Command, runMutationTest?: (options: PartialStrykerOptions) => Promise<MutantResult[]>);
    run(): void;
}
export declare function guardMinimalNodeVersion(processVersion?: string): void;
//# sourceMappingURL=stryker-cli.d.ts.map