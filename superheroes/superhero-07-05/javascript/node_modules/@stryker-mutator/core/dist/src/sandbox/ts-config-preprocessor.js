import path from 'path';
import { tokens, commonTokens } from '@stryker-mutator/api/plugin';
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
export class TSConfigPreprocessor {
    log;
    options;
    touched = new Set();
    static inject = tokens(commonTokens.logger, commonTokens.options);
    constructor(log, options) {
        this.log = log;
        this.options = options;
    }
    async preprocess(project) {
        if (this.options.inPlace) {
            // If stryker is running 'inPlace', we don't have to change the tsconfig file
            return;
        }
        else {
            this.touched.clear();
            await this.rewriteTSConfigFile(project, path.resolve(this.options.tsconfigFile));
        }
    }
    async rewriteTSConfigFile(project, tsconfigFileName) {
        if (!this.touched.has(tsconfigFileName)) {
            this.touched.add(tsconfigFileName);
            const tsconfigFile = project.files.get(tsconfigFileName);
            if (tsconfigFile) {
                this.log.debug('Rewriting file %s', tsconfigFile);
                const { default: ts } = await import('typescript');
                const { config } = ts.parseConfigFileTextToJson(tsconfigFileName, await tsconfigFile.readContent());
                if (config) {
                    await this.rewriteExtends(project, config, tsconfigFileName);
                    await this.rewriteProjectReferences(project, config, tsconfigFileName);
                    this.rewriteFileArrayProperty(config, tsconfigFileName, 'include');
                    this.rewriteFileArrayProperty(config, tsconfigFileName, 'exclude');
                    this.rewriteFileArrayProperty(config, tsconfigFileName, 'files');
                    tsconfigFile.setContent(JSON.stringify(config, null, 2));
                }
            }
        }
    }
    async rewriteExtends(project, config, tsconfigFileName) {
        const extend = config.extends;
        if (typeof extend === 'string') {
            const rewritten = this.tryRewriteReference(extend, tsconfigFileName);
            if (rewritten) {
                config.extends = rewritten;
            }
            else {
                await this.rewriteTSConfigFile(project, path.resolve(path.dirname(tsconfigFileName), extend));
            }
        }
    }
    rewriteFileArrayProperty(config, tsconfigFileName, prop) {
        const fileArray = config[prop];
        if (Array.isArray(fileArray)) {
            config[prop] = fileArray.map((pattern) => {
                const rewritten = this.tryRewriteReference(pattern, tsconfigFileName);
                if (rewritten) {
                    return rewritten;
                }
                else {
                    return pattern;
                }
            });
        }
    }
    async rewriteProjectReferences(project, config, originTSConfigFileName) {
        const { default: ts } = await import('typescript');
        if (Array.isArray(config.references)) {
            for (const reference of config.references) {
                const referencePath = ts.resolveProjectReferencePath(reference);
                const rewritten = this.tryRewriteReference(referencePath, originTSConfigFileName);
                if (rewritten) {
                    reference.path = rewritten;
                }
                else {
                    await this.rewriteTSConfigFile(project, path.resolve(path.dirname(originTSConfigFileName), referencePath));
                }
            }
        }
    }
    tryRewriteReference(reference, originTSConfigFileName) {
        const dirName = path.dirname(originTSConfigFileName);
        const fileName = path.resolve(dirName, reference);
        const relativeToSandbox = path.relative(process.cwd(), fileName);
        if (relativeToSandbox.startsWith('..')) {
            return this.join('..', '..', reference);
        }
        return false;
    }
    join(...pathSegments) {
        return pathSegments.map((segment) => segment.replace(/\\/g, '/')).join('/');
    }
}
//# sourceMappingURL=ts-config-preprocessor.js.map