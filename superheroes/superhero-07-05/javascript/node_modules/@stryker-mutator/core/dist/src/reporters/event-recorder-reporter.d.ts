import { MutantResult, schema, StrykerOptions } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { DryRunCompletedEvent, MutationTestingPlanReadyEvent } from '@stryker-mutator/api/report';
import { StrictReporter } from './strict-reporter.js';
export declare class EventRecorderReporter implements StrictReporter {
    private readonly log;
    private readonly options;
    static readonly inject: ["logger", "options"];
    private readonly allWork;
    private readonly createBaseFolderTask;
    private index;
    constructor(log: Logger, options: StrykerOptions);
    private writeToFile;
    private format;
    private work;
    onDryRunCompleted(event: DryRunCompletedEvent): void;
    onMutationTestingPlanReady(event: MutationTestingPlanReadyEvent): void;
    onMutantTested(result: MutantResult): void;
    onMutationTestReportReady(report: schema.MutationTestResult): void;
    wrapUp(): Promise<void>;
}
//# sourceMappingURL=event-recorder-reporter.d.ts.map