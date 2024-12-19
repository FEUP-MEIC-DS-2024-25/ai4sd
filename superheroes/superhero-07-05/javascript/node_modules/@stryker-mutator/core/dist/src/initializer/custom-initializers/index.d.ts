import { BaseContext, Injector } from '@stryker-mutator/api/plugin';
import type { resolveFromCwd } from '@stryker-mutator/util';
import { coreTokens } from '../../di/index.js';
import { CustomInitializer } from './custom-initializer.js';
interface CustomInitializerContext extends BaseContext {
    [coreTokens.execa]: typeof import('execa').execaCommand;
    [coreTokens.resolveFromCwd]: typeof resolveFromCwd;
}
export declare function createInitializers(injector: Injector<CustomInitializerContext>): CustomInitializer[];
export declare namespace createInitializers {
    var inject: readonly ["$injector"];
}
export {};
//# sourceMappingURL=index.d.ts.map