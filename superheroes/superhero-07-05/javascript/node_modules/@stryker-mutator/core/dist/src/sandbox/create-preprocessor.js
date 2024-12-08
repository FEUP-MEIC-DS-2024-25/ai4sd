import { tokens, commonTokens } from '@stryker-mutator/api/plugin';
import { disableTypeChecks } from '@stryker-mutator/instrumenter';
import { coreTokens } from '../di/index.js';
import { TSConfigPreprocessor } from './ts-config-preprocessor.js';
import { MultiPreprocessor } from './multi-preprocessor.js';
import { DisableTypeChecksPreprocessor } from './disable-type-checks-preprocessor.js';
createPreprocessor.inject = tokens(commonTokens.injector);
export function createPreprocessor(injector) {
    return new MultiPreprocessor([
        injector.provideValue(coreTokens.disableTypeChecksHelper, disableTypeChecks).injectClass(DisableTypeChecksPreprocessor),
        injector.injectClass(TSConfigPreprocessor),
    ]);
}
//# sourceMappingURL=create-preprocessor.js.map