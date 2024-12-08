import { Reporter } from '@stryker-mutator/api/report';
import type { MutantResult } from '@stryker-mutator/api/core';
export declare class DotsReporter implements Reporter {
    onMutantTested(result: MutantResult): void;
    onMutationTestReportReady(): void;
}
//# sourceMappingURL=dots-reporter.d.ts.map