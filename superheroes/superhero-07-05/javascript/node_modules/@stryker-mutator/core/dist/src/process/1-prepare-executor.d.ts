import { PartialStrykerOptions } from '@stryker-mutator/api/core';
import { BaseContext, Injector } from '@stryker-mutator/api/plugin';
import { MutantInstrumenterContext } from './index.js';
export declare class PrepareExecutor {
    private readonly injector;
    static readonly inject: ["$injector"];
    constructor(injector: Injector<BaseContext>);
    execute(cliOptions: PartialStrykerOptions): Promise<Injector<MutantInstrumenterContext>>;
}
//# sourceMappingURL=1-prepare-executor.d.ts.map