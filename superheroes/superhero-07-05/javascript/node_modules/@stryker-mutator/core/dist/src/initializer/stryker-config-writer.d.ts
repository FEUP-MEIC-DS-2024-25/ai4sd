import { StrykerOptions } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { PromptOption } from './prompt-option.js';
import { CustomInitializerConfiguration } from './custom-initializers/custom-initializer.js';
export declare class StrykerConfigWriter {
    private readonly log;
    private readonly out;
    static inject: ["logger", "out"];
    constructor(log: Logger, out: typeof console.log);
    guardForExistingConfig(): Promise<void>;
    private checkIfConfigFileExists;
    /**
     * Create config based on the chosen framework and test runner
     * @function
     */
    write(selectedTestRunner: PromptOption, buildCommand: PromptOption, selectedReporters: PromptOption[], selectedPackageManager: PromptOption, requiredPlugins: string[], additionalPiecesOfConfig: Array<Partial<StrykerOptions>>, homepageOfSelectedTestRunner: string, exportAsJson: boolean): Promise<string>;
    /**
     * Create config based on the chosen preset
     * @function
     */
    writeCustomInitializer(initializerConfig: CustomInitializerConfiguration, exportAsJson: boolean): Promise<string>;
    private writeStrykerConfig;
    private writeJsConfig;
    private writeJsonConfig;
    private stringify;
}
//# sourceMappingURL=stryker-config-writer.d.ts.map