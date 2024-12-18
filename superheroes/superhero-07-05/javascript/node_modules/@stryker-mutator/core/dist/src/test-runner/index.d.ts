import { TestRunner } from '@stryker-mutator/api/test-runner';
import { FileDescriptions, StrykerOptions } from '@stryker-mutator/api/core';
import { LoggerFactoryMethod } from '@stryker-mutator/api/logging';
import { LoggingClientContext } from '../logging/index.js';
import { Sandbox } from '../sandbox/sandbox.js';
import { IdGenerator } from '../child-proxy/id-generator.js';
export declare function createTestRunnerFactory(options: StrykerOptions, fileDescriptions: FileDescriptions, sandbox: Pick<Sandbox, 'workingDirectory'>, loggingContext: LoggingClientContext, getLogger: LoggerFactoryMethod, pluginModulePaths: readonly string[], idGenerator: IdGenerator): () => TestRunner;
export declare namespace createTestRunnerFactory {
    var inject: ["options", "fileDescriptions", "sandbox", "loggingContext", "getLogger", "pluginModulePaths", "worker-id-generator"];
}
//# sourceMappingURL=index.d.ts.map