import { I } from '@stryker-mutator/util';
import { Logger } from '@stryker-mutator/api/logging';
import { Injector } from '@stryker-mutator/api/plugin';
import { StrykerOptions, Mutant } from '@stryker-mutator/api/core';
import { coreTokens } from '../di/index.js';
import { Sandbox } from '../sandbox/sandbox.js';
import { Timer } from '../utils/timer.js';
import { ConcurrencyTokenProvider, Pool } from '../concurrent/index.js';
import { CheckerFacade } from '../checker/index.js';
import { StrictReporter } from '../reporters/index.js';
import { MutationTestContext } from './4-mutation-test-executor.js';
import { MutantInstrumenterContext } from './2-mutant-instrumenter-executor.js';
export interface DryRunContext extends MutantInstrumenterContext {
    [coreTokens.sandbox]: I<Sandbox>;
    [coreTokens.mutants]: readonly Mutant[];
    [coreTokens.checkerPool]: I<Pool<I<CheckerFacade>>>;
    [coreTokens.concurrencyTokenProvider]: I<ConcurrencyTokenProvider>;
}
export declare class DryRunExecutor {
    private readonly injector;
    private readonly log;
    private readonly options;
    private readonly timer;
    private readonly concurrencyTokenProvider;
    private readonly sandbox;
    private readonly reporter;
    static readonly inject: ["$injector", "logger", "options", "timer", "concurrencyTokenProvider", "sandbox", "reporter"];
    constructor(injector: Injector<DryRunContext>, log: Logger, options: StrykerOptions, timer: I<Timer>, concurrencyTokenProvider: I<ConcurrencyTokenProvider>, sandbox: I<Sandbox>, reporter: StrictReporter);
    execute(): Promise<Injector<MutationTestContext>>;
    private validateResultCompleted;
    private executeDryRun;
    /**
     * Remaps test files to their respective original names outside the sandbox.
     * @param dryRunResult the completed result
     */
    private remapSandboxFilesToOriginalFiles;
    private logInitialTestRunSucceeded;
    /**
     * Calculates the timing variables for the test run.
     * grossTime = NetTime + overheadTime
     *
     * The overhead time is used to calculate exact timeout values during mutation testing.
     * See timeoutMS setting in README for more information on this calculation
     */
    private calculateTiming;
    private logFailedTestsInInitialRun;
    private logErrorsInInitialRun;
    private logTimeoutInitialRun;
}
//# sourceMappingURL=3-dry-run-executor.d.ts.map