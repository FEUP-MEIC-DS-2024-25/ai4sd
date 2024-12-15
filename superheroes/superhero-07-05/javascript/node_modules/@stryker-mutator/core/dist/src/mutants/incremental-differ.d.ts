import { schema, Mutant, StrykerOptions, FileDescriptions } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { I } from '@stryker-mutator/util';
import { DiffStatisticsCollector } from './diff-statistics-collector.js';
import { TestCoverage } from './test-coverage.js';
/**
 * This class is responsible for calculating the diff between a run and a previous run based on the incremental report.
 *
 * Since the ids of tests and mutants can differ across reports (they are only unique within 1 report), this class
 * identifies mutants and tests by attributes that make them unique:
 * - Mutant: file name, mutator name, location and replacement
 * - Test: test name, test file name (if present) and location (if present).
 *
 * We're storing these identifiers in local variables (maps and sets) as strings.
 * We should move to 'records' for these when they come available: https://github.com/tc39/proposal-record-tuple
 *
 * A mutant result from the previous run is reused if the following conditions were met:
 * - The location of the mutant refers to a piece of code that didn't change
 * - If mutant was killed:
 *   - The culprit test wasn't changed
 * - If the mutant survived:
 *   - No test was added
 *
 * It uses google's "diff-match-patch" project to calculate the new locations for tests and mutants, see link.
 * @link https://github.com/google/diff-match-patch
 */
export declare class IncrementalDiffer {
    private readonly logger;
    private readonly options;
    mutantStatisticsCollector: DiffStatisticsCollector | undefined;
    testStatisticsCollector: DiffStatisticsCollector | undefined;
    private readonly mutateDescriptionByRelativeFileName;
    static inject: readonly ["logger", "options", "fileDescriptions"];
    constructor(logger: Logger, options: StrykerOptions, fileDescriptions: FileDescriptions);
    private isInMutatedScope;
    diff(currentMutants: readonly Mutant[], testCoverage: I<TestCoverage>, incrementalReport: schema.MutationTestResult, currentRelativeFiles: Map<string, string>): readonly Mutant[];
}
export declare function toRelativeNormalizedFileName(fileName: string | undefined): string;
//# sourceMappingURL=incremental-differ.d.ts.map