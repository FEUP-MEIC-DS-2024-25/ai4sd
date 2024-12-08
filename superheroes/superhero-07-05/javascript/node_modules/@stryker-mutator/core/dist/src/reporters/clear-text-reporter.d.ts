import { schema, StrykerOptions } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { Reporter } from '@stryker-mutator/api/report';
import { MutationTestMetricsResult } from 'mutation-testing-metrics';
export declare class ClearTextReporter implements Reporter {
    private readonly log;
    private readonly options;
    static inject: ["logger", "options"];
    constructor(log: Logger, options: StrykerOptions);
    private readonly out;
    private readonly writeLine;
    private readonly writeDebugLine;
    private configConsoleColor;
    onMutationTestReportReady(_report: schema.MutationTestResult, metrics: MutationTestMetricsResult): void;
    private reportTests;
    private reportMutants;
    private statusLabel;
    private reportMutantResult;
    private colorSourceFileAndLocation;
    private color;
    private logExecutedTests;
}
//# sourceMappingURL=clear-text-reporter.d.ts.map