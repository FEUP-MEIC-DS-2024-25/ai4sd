import type { execaCommand } from 'execa';
import { type resolveFromCwd } from '@stryker-mutator/util';
import { Logger } from '@stryker-mutator/api/logging';
import { CustomInitializer, CustomInitializerConfiguration } from './custom-initializer.js';
export declare class AngularInitializer implements CustomInitializer {
    private readonly log;
    private readonly execa;
    private readonly resolve;
    static inject: readonly ["logger", "execa", "resolveFromCwd"];
    constructor(log: Logger, execa: typeof execaCommand, resolve: typeof resolveFromCwd);
    readonly name = "angular-cli";
    private readonly dependencies;
    private readonly config;
    createConfig(): Promise<CustomInitializerConfiguration>;
    private getCurrentAngularVersion;
}
//# sourceMappingURL=angular-initializer.d.ts.map