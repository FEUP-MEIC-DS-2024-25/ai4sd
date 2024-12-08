import { Logger } from '@stryker-mutator/api/logging';
import { HttpClient } from 'typed-rest-client/HttpClient.js';
import { StrykerOptions } from '@stryker-mutator/api/core';
import { Report } from './report.js';
export declare class DashboardReporterClient {
    private readonly log;
    private readonly httpClient;
    private readonly options;
    static inject: ["logger", "httpClient", "options"];
    constructor(log: Logger, httpClient: HttpClient, options: StrykerOptions);
    updateReport({ report, projectName, version, moduleName, }: {
        report: Report;
        projectName: string;
        version: string;
        moduleName: string | undefined;
    }): Promise<string>;
    private getPutUrl;
}
//# sourceMappingURL=dashboard-reporter-client.d.ts.map