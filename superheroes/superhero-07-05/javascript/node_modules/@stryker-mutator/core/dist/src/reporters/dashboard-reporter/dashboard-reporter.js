import { commonTokens, tokens } from '@stryker-mutator/api/plugin';
import { dashboardReporterTokens } from './tokens.js';
export class DashboardReporter {
    log;
    dashboardReporterClient;
    options;
    ciProvider;
    static inject = tokens(commonTokens.logger, dashboardReporterTokens.dashboardReporterClient, commonTokens.options, dashboardReporterTokens.ciProvider);
    constructor(log, dashboardReporterClient, options, ciProvider) {
        this.log = log;
        this.dashboardReporterClient = dashboardReporterClient;
        this.options = options;
        this.ciProvider = ciProvider;
    }
    onGoingWork;
    onMutationTestReportReady(result, metrics) {
        this.onGoingWork = (async () => {
            const { projectName, version, moduleName } = this.getContextFromEnvironment();
            if (projectName && version) {
                await this.update(this.toReport(result, metrics), projectName, version, moduleName);
            }
            else {
                this.log.info('The report was not send to the dashboard. The dashboard.project and/or dashboard.version values were missing and not detected to be running on a build server.');
            }
        })();
    }
    async wrapUp() {
        await this.onGoingWork;
    }
    toReport(result, metrics) {
        if (this.options.dashboard.reportType === "full" /* ReportType.Full */) {
            return result;
        }
        else {
            return {
                mutationScore: metrics.systemUnderTestMetrics.metrics.mutationScore,
            };
        }
    }
    async update(report, projectName, version, moduleName) {
        try {
            const href = await this.dashboardReporterClient.updateReport({
                report,
                moduleName,
                projectName,
                version: version,
            });
            this.log.info('Report available at: %s', href);
        }
        catch (err) {
            this.log.error('Could not upload report.', err);
        }
    }
    getContextFromEnvironment() {
        return {
            moduleName: this.options.dashboard.module,
            projectName: this.options.dashboard.project ?? this.ciProvider?.determineProject(),
            version: this.options.dashboard.version ?? this.ciProvider?.determineVersion(),
        };
    }
}
//# sourceMappingURL=dashboard-reporter.js.map