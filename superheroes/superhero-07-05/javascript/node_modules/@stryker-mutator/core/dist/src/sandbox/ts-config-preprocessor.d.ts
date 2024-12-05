import { StrykerOptions } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { Project } from '../fs/project.js';
import { FilePreprocessor } from './file-preprocessor.js';
export interface TSConfig {
    references?: Array<{
        path: string;
    }>;
    extends?: string;
    files?: string[];
    exclude?: string[];
    include?: string[];
    compilerOptions?: Record<string, unknown>;
}
/**
 * A helper class that rewrites `references` and `extends` file paths if they end up falling outside of the sandbox.
 * @example
 * {
 *   "extends": "../../tsconfig.settings.json",
 *   "references": {
 *      "path": "../model"
 *   }
 * }
 * becomes:
 * {
 *   "extends": "../../../../tsconfig.settings.json",
 *   "references": {
 *      "path": "../../../model"
 *   }
 * }
 */
export declare class TSConfigPreprocessor implements FilePreprocessor {
    private readonly log;
    private readonly options;
    private readonly touched;
    static readonly inject: ["logger", "options"];
    constructor(log: Logger, options: StrykerOptions);
    preprocess(project: Project): Promise<void>;
    private rewriteTSConfigFile;
    private rewriteExtends;
    private rewriteFileArrayProperty;
    private rewriteProjectReferences;
    private tryRewriteReference;
    private join;
}
//# sourceMappingURL=ts-config-preprocessor.d.ts.map