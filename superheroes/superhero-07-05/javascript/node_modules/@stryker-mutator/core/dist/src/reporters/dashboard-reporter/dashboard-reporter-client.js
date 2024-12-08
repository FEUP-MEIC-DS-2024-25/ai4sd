import { commonTokens, tokens } from '@stryker-mutator/api/plugin';
import { StrykerError } from '@stryker-mutator/util';
import { objectUtils } from '../../utils/object-utils.js';
import { dashboardReporterTokens } from './tokens.js';
const STRYKER_DASHBOARD_API_KEY = 'STRYKER_DASHBOARD_API_KEY';
export class DashboardReporterClient {
    log;
    httpClient;
    options;
    static inject = tokens(commonTokens.logger, dashboardReporterTokens.httpClient, commonTokens.options);
    constructor(log, httpClient, options) {
        this.log = log;
        this.httpClient = httpClient;
        this.options = options;
    }
    async updateReport({ report, projectName, version, moduleName, }) {
        const url = this.getPutUrl(projectName, version, moduleName);
        const serializedBody = JSON.stringify(report);
        this.log.info('PUT report to %s (~%s bytes)', url, serializedBody.length);
        const apiKey = objectUtils.getEnvironmentVariable(STRYKER_DASHBOARD_API_KEY);
        if (apiKey) {
            this.log.debug('Using configured API key from environment "%s"', STRYKER_DASHBOARD_API_KEY);
        }
        this.log.trace('PUT report %s', serializedBody);
        const result = await this.httpClient.put(url, serializedBody, {
            ['X-Api-Key']: apiKey,
            ['Content-Type']: 'application/json',
        });
        const responseBody = await result.readBody();
        if (isOK(result.message.statusCode ?? 0)) {
            const response = JSON.parse(responseBody);
            return response.href;
        }
        else if (result.message.statusCode === 401) {
            throw new StrykerError(`Error HTTP PUT ${url}. Unauthorized. Did you provide the correct api key in the "${STRYKER_DASHBOARD_API_KEY}" environment variable?`);
        }
        else {
            throw new StrykerError(`Error HTTP PUT ${url}. Response status code: ${result.message.statusCode}. Response body: ${responseBody}`);
        }
    }
    getPutUrl(repoSlug, version, moduleName) {
        const base = `${this.options.dashboard.baseUrl}/${repoSlug}/${encodeURIComponent(version)}`;
        if (moduleName) {
            return `${base}?module=${encodeURIComponent(moduleName)}`;
        }
        else {
            return base;
        }
    }
}
function isOK(statusCode) {
    return statusCode >= 200 && statusCode < 300;
}
//# sourceMappingURL=dashboard-reporter-client.js.map