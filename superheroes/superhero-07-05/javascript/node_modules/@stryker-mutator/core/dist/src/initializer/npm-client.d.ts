import { Logger } from '@stryker-mutator/api/logging';
import type { RestClient } from 'typed-rest-client/RestClient.js';
import { PackageInfo, PackageSummary } from './package-info.js';
import { PromptOption } from './prompt-option.js';
export interface NpmSearchResult {
    total: number;
    objects: Array<{
        package: PackageSummary;
    }>;
}
export declare class NpmClient {
    private readonly log;
    private readonly innerNpmClient;
    private readonly npmRegistry;
    static inject: ["logger", "restClientNpm", "npmRegistry"];
    constructor(log: Logger, innerNpmClient: RestClient, npmRegistry: string);
    getTestRunnerOptions(): Promise<PromptOption[]>;
    getTestReporterOptions(): Promise<PromptOption[]>;
    getAdditionalConfig(pkgInfo: PackageSummary): Promise<PackageInfo>;
    private search;
}
//# sourceMappingURL=npm-client.d.ts.map