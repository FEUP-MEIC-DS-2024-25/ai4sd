import { Logger } from '@stryker-mutator/api/logging';
import { createParser } from './parsers/index.js';
import { transform } from './transformers/index.js';
import { print } from './printers/index.js';
import { InstrumentResult } from './instrument-result.js';
import { InstrumenterOptions } from './instrumenter-options.js';
import { File } from './file.js';
/**
 * The instrumenter is responsible for
 * * Generating mutants based on source files
 * * Instrumenting the source code with the mutants placed in `mutant switches`.
 * * Adding mutant coverage expressions in the source code.
 * @see https://github.com/stryker-mutator/stryker-js/issues/1514
 */
export declare class Instrumenter {
    private readonly logger;
    private readonly _createParser;
    private readonly _print;
    private readonly _transform;
    static inject: ["logger", "instrumenterCreateParser", "instrumenterPrint", "instrumenterTransform"];
    constructor(logger: Logger, _createParser?: typeof createParser, _print?: typeof print, _transform?: typeof transform);
    instrument(files: readonly File[], options: InstrumenterOptions): Promise<InstrumentResult>;
}
//# sourceMappingURL=instrumenter.d.ts.map