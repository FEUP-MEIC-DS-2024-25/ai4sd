import { FileDescriptions, StrykerOptions } from '@stryker-mutator/api/core';
import { LoggerFactoryMethod } from '@stryker-mutator/api/logging';
import { IdGenerator } from '../child-proxy/id-generator.js';
import { LoggingClientContext } from '../logging/logging-client-context.js';
import { CheckerFacade } from './checker-facade.js';
export declare function createCheckerFactory(options: StrykerOptions, fileDescriptions: FileDescriptions, loggingContext: LoggingClientContext, pluginModulePaths: readonly string[], getLogger: LoggerFactoryMethod, idGenerator: IdGenerator): () => CheckerFacade;
export declare namespace createCheckerFactory {
    var inject: ["options", "fileDescriptions", "loggingContext", "pluginModulePaths", "getLogger", "worker-id-generator"];
}
//# sourceMappingURL=checker-factory.d.ts.map