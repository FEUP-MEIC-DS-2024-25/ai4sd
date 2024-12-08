import { StrykerOptions } from '@stryker-mutator/api/core';
import type { disableTypeChecks } from '@stryker-mutator/instrumenter';
import { Logger } from '@stryker-mutator/api/logging';
import { Project } from '../fs/project.js';
import { FilePreprocessor } from './file-preprocessor.js';
/**
 * Disabled type checking by inserting `@ts-nocheck` atop TS/JS files and removing other @ts-xxx directives from comments:
 * @see https://github.com/stryker-mutator/stryker-js/issues/2438
 */
export declare class DisableTypeChecksPreprocessor implements FilePreprocessor {
    private readonly log;
    private readonly options;
    private readonly impl;
    static readonly inject: ["logger", "options", "disableTypeChecksHelper"];
    constructor(log: Logger, options: StrykerOptions, impl: typeof disableTypeChecks);
    preprocess(project: Project): Promise<void>;
}
//# sourceMappingURL=disable-type-checks-preprocessor.d.ts.map