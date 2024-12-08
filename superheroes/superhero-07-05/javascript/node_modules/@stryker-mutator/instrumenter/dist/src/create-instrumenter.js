import { commonTokens, tokens } from '@stryker-mutator/api/plugin';
import { instrumenterTokens } from './instrumenter-tokens.js';
import { createParser } from './parsers/index.js';
import { print } from './printers/index.js';
import { transform } from './transformers/index.js';
import { Instrumenter } from './index.js';
createInstrumenter.inject = tokens(commonTokens.injector);
export function createInstrumenter(injector) {
    return injector
        .provideValue(instrumenterTokens.print, print)
        .provideValue(instrumenterTokens.createParser, createParser)
        .provideValue(instrumenterTokens.transform, transform)
        .injectClass(Instrumenter);
}
//# sourceMappingURL=create-instrumenter.js.map