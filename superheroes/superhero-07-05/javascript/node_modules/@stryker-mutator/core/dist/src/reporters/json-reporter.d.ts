import { schema, StrykerOptions } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { Reporter } from '@stryker-mutator/api/report';
export declare const RESOURCES_DIR_NAME = "strykerResources";
export declare class JsonReporter implements Reporter {
    private readonly options;
    private readonly log;
    private mainPromise;
    constructor(options: StrykerOptions, log: Logger);
    static readonly inject: ["options", "logger"];
    onMutationTestReportReady(report: schema.MutationTestResult): void;
    wrapUp(): Promise<void> | undefined;
    private generateReport;
}
//# sourceMappingURL=json-reporter.d.ts.map