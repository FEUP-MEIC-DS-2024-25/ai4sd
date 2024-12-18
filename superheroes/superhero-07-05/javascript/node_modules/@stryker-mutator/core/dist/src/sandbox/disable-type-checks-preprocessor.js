import path from 'path';
import { commonTokens, tokens } from '@stryker-mutator/api/plugin';
import { optionsPath } from '../utils/index.js';
import { coreTokens } from '../di/index.js';
import { objectUtils } from '../utils/object-utils.js';
import { FileMatcher } from '../config/index.js';
/**
 * Disabled type checking by inserting `@ts-nocheck` atop TS/JS files and removing other @ts-xxx directives from comments:
 * @see https://github.com/stryker-mutator/stryker-js/issues/2438
 */
export class DisableTypeChecksPreprocessor {
    log;
    options;
    impl;
    static inject = tokens(commonTokens.logger, commonTokens.options, coreTokens.disableTypeChecksHelper);
    constructor(log, options, impl) {
        this.log = log;
        this.options = options;
        this.impl = impl;
    }
    async preprocess(project) {
        const matcher = new FileMatcher(this.options.disableTypeChecks);
        let warningLogged = false;
        await Promise.all(objectUtils.map(project.files, async (file, name) => {
            if (matcher.matches(path.resolve(name))) {
                try {
                    const { content } = await this.impl(await file.toInstrumenterFile(), { plugins: this.options.mutator.plugins });
                    file.setContent(content);
                }
                catch (err) {
                    if (objectUtils.isWarningEnabled('preprocessorErrors', this.options.warnings)) {
                        warningLogged = true;
                        this.log.warn(`Unable to disable type checking for file "${name}". Shouldn't type checking be disabled for this file? Consider configuring a more restrictive "${optionsPath('disableTypeChecks')}" settings (or turn it completely off with \`false\`)`, err);
                    }
                }
            }
        }));
        if (warningLogged) {
            this.log.warn(`(disable "${optionsPath('warnings', 'preprocessorErrors')}" to ignore this warning`);
        }
    }
}
//# sourceMappingURL=disable-type-checks-preprocessor.js.map