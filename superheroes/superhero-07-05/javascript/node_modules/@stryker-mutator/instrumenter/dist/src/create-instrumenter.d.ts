import { BaseContext, Injector } from '@stryker-mutator/api/plugin';
import { instrumenterTokens } from './instrumenter-tokens.js';
import { createParser } from './parsers/index.js';
import { print } from './printers/index.js';
import { transform } from './transformers/index.js';
import { Instrumenter } from './index.js';
export interface InstrumenterContext extends BaseContext {
    [instrumenterTokens.createParser]: typeof createParser;
    [instrumenterTokens.print]: typeof print;
    [instrumenterTokens.transform]: typeof transform;
}
export declare function createInstrumenter(injector: Injector<BaseContext>): Instrumenter;
export declare namespace createInstrumenter {
    var inject: ["$injector"];
}
//# sourceMappingURL=create-instrumenter.d.ts.map