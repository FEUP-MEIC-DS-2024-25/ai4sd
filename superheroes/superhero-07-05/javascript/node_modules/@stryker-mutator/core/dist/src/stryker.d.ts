import { MutantResult, PartialStrykerOptions } from '@stryker-mutator/api/core';
import { createInjector } from 'typed-inject';
/**
 * The main Stryker class.
 * It provides a single `runMutationTest()` function which runs mutation testing:
 */
export declare class Stryker {
    private readonly cliOptions;
    private readonly injectorFactory;
    /**
     * @constructor
     * @param cliOptions The cli options.
     * @param injectorFactory The injector factory, for testing purposes only
     */
    constructor(cliOptions: PartialStrykerOptions, injectorFactory?: typeof createInjector);
    runMutationTest(): Promise<MutantResult[]>;
}
//# sourceMappingURL=stryker.d.ts.map