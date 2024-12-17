import { Injector } from 'typed-inject';
import { commonTokens } from '@stryker-mutator/api/plugin';
import { LoggerFactoryMethod, Logger } from '@stryker-mutator/api/logging';
export declare function provideLogger(injector: Injector): LoggerProvider;
export type LoggerProvider = Injector<{
    [commonTokens.getLogger]: LoggerFactoryMethod;
    [commonTokens.logger]: Logger;
}>;
//# sourceMappingURL=provide-logger.d.ts.map