import { MutantRunPlan, MutantTestPlan, Mutant, StrykerOptions, MutantEarlyResultPlan } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { I } from '@stryker-mutator/util';
import { StrictReporter } from '../reporters/strict-reporter.js';
import { Sandbox } from '../sandbox/index.js';
import { Project } from '../fs/project.js';
import { IncrementalDiffer } from './incremental-differ.js';
import { TestCoverage } from './test-coverage.js';
/**
 * Responsible for determining the tests to execute for each mutant, as well as other run option specific details
 *
 */
export declare class MutantTestPlanner {
    private readonly testCoverage;
    private readonly incrementalDiffer;
    private readonly reporter;
    private readonly sandbox;
    private readonly project;
    private readonly timeOverheadMS;
    private readonly options;
    private readonly logger;
    static readonly inject: ["testCoverage", "incrementalDiffer", "reporter", "sandbox", "project", "timeOverheadMS", "options", "logger"];
    private readonly timeSpentAllTests;
    constructor(testCoverage: I<TestCoverage>, incrementalDiffer: IncrementalDiffer, reporter: StrictReporter, sandbox: I<Sandbox>, project: I<Project>, timeOverheadMS: number, options: StrykerOptions, logger: Logger);
    makePlan(mutants: readonly Mutant[]): Promise<readonly MutantTestPlan[]>;
    private planMutant;
    private createMutantEarlyResultPlan;
    private createMutantRunPlan;
    private warnAboutSlow;
    private incrementalDiff;
    private readAllOriginalFiles;
}
export declare function isEarlyResult(mutantPlan: MutantTestPlan): mutantPlan is MutantEarlyResultPlan;
export declare function isRunPlan(mutantPlan: MutantTestPlan): mutantPlan is MutantRunPlan;
//# sourceMappingURL=mutant-test-planner.d.ts.map