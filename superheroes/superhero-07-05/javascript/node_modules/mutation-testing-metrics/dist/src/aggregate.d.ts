import type { MutationTestResult } from 'mutation-testing-report-schema';
/**
 * Aggregates multiple reports together into a single report, grouped by module.
 *
 * @param resultsByModule The MutationTestResult objects by module name
 * @returns An aggregated result of all provided reports.
 */
export declare function aggregateResultsByModule(resultsByModule: Record<string, MutationTestResult>): MutationTestResult;
//# sourceMappingURL=aggregate.d.ts.map