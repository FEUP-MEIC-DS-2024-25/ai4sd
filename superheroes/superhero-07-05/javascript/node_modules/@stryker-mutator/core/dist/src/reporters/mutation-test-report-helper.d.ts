import { StrykerOptions, MutantTestCoverage, MutantResult, MutantStatus } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { Reporter } from '@stryker-mutator/api/report';
import { I, type requireResolve } from '@stryker-mutator/util';
import { MutantRunResult } from '@stryker-mutator/api/test-runner';
import { PassedCheckResult, CheckResult } from '@stryker-mutator/api/check';
import { Project, FileSystem } from '../fs/index.js';
import { TestCoverage } from '../mutants/index.js';
/**
 * A helper class to convert and report mutants that survived or get killed
 */
export declare class MutationTestReportHelper {
    private readonly reporter;
    private readonly options;
    private readonly project;
    private readonly log;
    private readonly testCoverage;
    private readonly fs;
    private readonly requireFromCwd;
    static inject: ["reporter", "options", "project", "logger", "testCoverage", "fs", "requireFromCwd"];
    constructor(reporter: Required<Reporter>, options: StrykerOptions, project: Project, log: Logger, testCoverage: I<TestCoverage>, fs: I<FileSystem>, requireFromCwd: typeof requireResolve);
    reportCheckFailed(mutant: MutantTestCoverage, checkResult: Exclude<CheckResult, PassedCheckResult>): MutantResult;
    reportMutantStatus(mutant: MutantTestCoverage, status: MutantStatus): MutantResult;
    reportMutantRunResult(mutant: MutantTestCoverage, result: MutantRunResult): MutantResult;
    private reportOne;
    private checkStatusToResultStatus;
    reportAll(results: MutantResult[]): Promise<void>;
    private determineExitCode;
    private mutationTestReport;
    private toFileResults;
    private toTestFiles;
    private toFileResult;
    private toTestFile;
    private toTestDefinition;
    private determineLanguage;
    private toMutantResult;
    private toLocation;
    private toPosition;
    private discoverDependencies;
}
//# sourceMappingURL=mutation-test-report-helper.d.ts.map