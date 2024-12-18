import type { FileResult, MutationTestResult } from 'mutation-testing-report-schema';
import type { Metrics, MutationTestMetricsResult, TestMetrics } from './model/index.js';
import { FileUnderTestModel, MetricsResult, TestFileModel } from './model/index.js';
/**
 * Calculates the files-under-test metrics inside of a mutation testing report
 * @param files The files inside the mutation testing report
 * @returns A MetricsResult containing the metrics for the entire report. See `childResults`
 */
export declare function calculateMetrics(files: Record<string, FileResult>): MetricsResult<FileUnderTestModel, Metrics>;
/**
 * Calculates the full mutation test metrics from both the files-under-test as well as (optionally) the test files.
 * @param result The full mutation test result
 * @returns A MutationTestMetricsResult that contains both the `systemUnderTestMetrics` as well as the `testMetrics`
 */
export declare function calculateMutationTestMetrics(result: MutationTestResult): MutationTestMetricsResult;
export declare function calculateFileMetrics<TFileModel, TMetrics>(fileName: string, file: TFileModel, calculateMetrics: (files: TFileModel[]) => TMetrics): MetricsResult<TFileModel, TMetrics>;
export declare function countTestFileMetrics(testFile: TestFileModel[]): TestMetrics;
export declare function countFileMetrics(fileResult: FileUnderTestModel[]): Metrics;
//# sourceMappingURL=calculateMetrics.d.ts.map