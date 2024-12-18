import { CustomInitializer } from './custom-initializers/custom-initializer.js';
import { PromptOption } from './prompt-option.js';
export interface PromptResult {
    additionalNpmDependencies: string[];
    additionalConfig: Record<string, unknown>;
}
export declare class StrykerInquirer {
    promptPresets(options: CustomInitializer[]): Promise<CustomInitializer | undefined>;
    promptTestRunners(options: PromptOption[]): Promise<PromptOption>;
    promptBuildCommand(): Promise<PromptOption>;
    promptReporters(options: PromptOption[]): Promise<PromptOption[]>;
    promptPackageManager(options: PromptOption[]): Promise<PromptOption>;
    promptJsonConfigFormat(): Promise<boolean>;
}
//# sourceMappingURL=stryker-inquirer.d.ts.map