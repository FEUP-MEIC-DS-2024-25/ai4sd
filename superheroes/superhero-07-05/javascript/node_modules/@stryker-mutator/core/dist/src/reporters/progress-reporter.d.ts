import { MutantResult } from '@stryker-mutator/api/core';
import { MutationTestingPlanReadyEvent } from '@stryker-mutator/api/report';
import { ProgressKeeper } from './progress-keeper.js';
export declare class ProgressBarReporter extends ProgressKeeper {
    private progressBar?;
    onMutationTestingPlanReady(event: MutationTestingPlanReadyEvent): void;
    onMutantTested(result: MutantResult): number;
    private tick;
    private render;
}
//# sourceMappingURL=progress-reporter.d.ts.map