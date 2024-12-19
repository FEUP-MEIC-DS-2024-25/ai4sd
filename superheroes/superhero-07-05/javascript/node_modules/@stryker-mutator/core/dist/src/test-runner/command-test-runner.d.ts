import { StrykerOptions } from '@stryker-mutator/api/core';
import { TestRunner, MutantRunOptions, DryRunResult, MutantRunResult, TestRunnerCapabilities } from '@stryker-mutator/api/test-runner';
/**
 * A test runner that uses a (bash or cmd) command to execute the tests.
 * Does not know hom many tests are executed or any code coverage results,
 * instead, it mimics a simple test result based on the exit code.
 * The command can be configured, but defaults to `npm test`.
 */
export declare class CommandTestRunner implements TestRunner {
    private readonly workingDir;
    /**
     * "command"
     */
    static readonly runnerName: string;
    /**
     * Determines whether a given name is "command" (ignore case)
     * @param name Maybe "command", maybe not
     */
    static is(name: string): name is 'command';
    private readonly settings;
    private timeoutHandler;
    constructor(workingDir: string, options: StrykerOptions);
    capabilities(): TestRunnerCapabilities;
    dryRun(): Promise<DryRunResult>;
    mutantRun({ activeMutant }: Pick<MutantRunOptions, 'activeMutant'>): Promise<MutantRunResult>;
    private run;
    dispose(): Promise<void>;
}
//# sourceMappingURL=command-test-runner.d.ts.map