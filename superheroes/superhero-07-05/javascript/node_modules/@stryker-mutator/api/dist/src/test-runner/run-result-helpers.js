import { TestStatus } from './test-status.js';
import { MutantRunStatus } from './mutant-run-result.js';
import { DryRunStatus } from './dry-run-status.js';
export function determineHitLimitReached(hitCount, hitLimit) {
    if (hitCount !== undefined && hitLimit !== undefined && hitCount > hitLimit) {
        return { status: DryRunStatus.Timeout, reason: `Hit limit reached (${hitCount}/${hitLimit})` };
    }
    return;
}
export function toMutantRunResult(dryRunResult, reportAllKillers = true) {
    switch (dryRunResult.status) {
        case DryRunStatus.Complete: {
            const failedTests = dryRunResult.tests.filter((test) => test.status === TestStatus.Failed);
            const nrOfTests = dryRunResult.tests.filter((test) => test.status !== TestStatus.Skipped).length;
            if (failedTests.length > 0) {
                return {
                    status: MutantRunStatus.Killed,
                    failureMessage: failedTests[0].failureMessage,
                    killedBy: reportAllKillers ? failedTests.map((test) => test.id) : [failedTests[0].id],
                    nrOfTests,
                };
            }
            else {
                return {
                    status: MutantRunStatus.Survived,
                    nrOfTests,
                };
            }
        }
        case DryRunStatus.Error:
            return {
                status: MutantRunStatus.Error,
                errorMessage: dryRunResult.errorMessage,
            };
        case DryRunStatus.Timeout:
            return {
                status: MutantRunStatus.Timeout,
                reason: dryRunResult.reason,
            };
    }
}
//# sourceMappingURL=run-result-helpers.js.map