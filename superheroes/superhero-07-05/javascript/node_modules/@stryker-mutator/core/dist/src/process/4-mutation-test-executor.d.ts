import { Observable } from 'rxjs';
import { MutantResult, Mutant, StrykerOptions, MutantRunPlan } from '@stryker-mutator/api/core';
import { TestRunner, CompleteDryRunResult } from '@stryker-mutator/api/test-runner';
import { Logger } from '@stryker-mutator/api/logging';
import { I } from '@stryker-mutator/util';
import { coreTokens } from '../di/index.js';
import { StrictReporter } from '../reporters/strict-reporter.js';
import { MutationTestReportHelper } from '../reporters/mutation-test-report-helper.js';
import { Timer } from '../utils/timer.js';
import { ConcurrencyTokenProvider, Pool } from '../concurrent/index.js';
import { MutantTestPlanner } from '../mutants/index.js';
import { CheckerFacade } from '../checker/index.js';
import { DryRunContext } from './3-dry-run-executor.js';
export interface MutationTestContext extends DryRunContext {
    [coreTokens.testRunnerPool]: I<Pool<TestRunner>>;
    [coreTokens.timeOverheadMS]: number;
    [coreTokens.mutationTestReportHelper]: MutationTestReportHelper;
    [coreTokens.mutantTestPlanner]: MutantTestPlanner;
    [coreTokens.dryRunResult]: I<CompleteDryRunResult>;
}
export declare class MutationTestExecutor {
    private readonly reporter;
    private readonly testRunnerPool;
    private readonly checkerPool;
    private readonly mutants;
    private readonly planner;
    private readonly mutationTestReportHelper;
    private readonly log;
    private readonly options;
    private readonly timer;
    private readonly concurrencyTokenProvider;
    private readonly dryRunResult;
    static inject: ["reporter", "testRunnerPool", "checkerPool", "mutants", "mutantTestPlanner", "mutationTestReportHelper", "logger", "options", "timer", "concurrencyTokenProvider", "dryRunResult"];
    constructor(reporter: StrictReporter, testRunnerPool: I<Pool<TestRunner>>, checkerPool: I<Pool<I<CheckerFacade>>>, mutants: readonly Mutant[], planner: MutantTestPlanner, mutationTestReportHelper: I<MutationTestReportHelper>, log: Logger, options: StrykerOptions, timer: I<Timer>, concurrencyTokenProvider: I<ConcurrencyTokenProvider>, dryRunResult: CompleteDryRunResult);
    execute(): Promise<MutantResult[]>;
    private executeEarlyResult;
    private executeNoCoverage;
    private executeRunInTestRunner;
    private logDone;
    /**
     * Checks mutants against all configured checkers (if any) and returns steams for failed checks and passed checks respectively
     * @param input$ The mutant run plans to check
     */
    executeCheck(input$: Observable<MutantRunPlan>): {
        checkResult$: Observable<MutantResult>;
        passedMutant$: Observable<MutantRunPlan>;
    };
    /**
     * Executes the check task for one checker
     * @param checkerName The name of the checker to execute
     * @param input$ The mutants tasks to check
     * @returns An observable stream with early results (check failed) and passed results
     */
    private executeSingleChecker;
}
//# sourceMappingURL=4-mutation-test-executor.d.ts.map