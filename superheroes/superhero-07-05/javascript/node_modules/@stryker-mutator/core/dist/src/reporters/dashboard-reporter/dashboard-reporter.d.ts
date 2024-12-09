import { StrykerOptions, schema } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { Reporter } from '@stryker-mutator/api/report';
import { MutationTestMetricsResult } from 'mutation-testing-metrics';
import { CIProvider } from '../ci/provider.js';
import { DashboardReporterClient } from './dashboard-reporter-client.js';
export declare class DashboardReporter implements Reporter {
    private readonly log;
    private readonly dashboardReporterClient;
    private readonly options;
    private readonly ciProvider;
    static readonly inject: ["logger", "dashboardReporterClient", "options", "ciProvider"];
    constructor(log: Logger, dashboardReporterClient: DashboardReporterClient, options: StrykerOptions, ciProvider: CIProvider | null);
    private onGoingWork;
    onMutationTestReportReady(result: schema.MutationTestResult, metrics: MutationTestMetricsResult): void;
    wrapUp(): Promise<void>;
    private toReport;
    private update;
    private getContextFromEnvironment;
}
//# sourceMappingURL=dashboard-reporter.d.ts.map