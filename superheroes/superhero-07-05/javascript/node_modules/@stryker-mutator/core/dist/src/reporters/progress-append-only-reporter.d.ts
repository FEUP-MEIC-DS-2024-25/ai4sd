import { MutationTestingPlanReadyEvent } from '@stryker-mutator/api/report';
import { ProgressKeeper } from './progress-keeper.js';
export declare class ProgressAppendOnlyReporter extends ProgressKeeper {
    private intervalReference?;
    onMutationTestingPlanReady(event: MutationTestingPlanReadyEvent): void;
    onMutationTestReportReady(): void;
    private render;
    private getPercentDone;
}
//# sourceMappingURL=progress-append-only-reporter.d.ts.map