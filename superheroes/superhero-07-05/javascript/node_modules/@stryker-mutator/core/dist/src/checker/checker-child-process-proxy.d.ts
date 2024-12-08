import { FileDescriptions, Mutant, StrykerOptions } from '@stryker-mutator/api/core';
import { Disposable } from 'typed-inject';
import { LoggingClientContext } from '../logging/index.js';
import { Resource } from '../concurrent/pool.js';
import { IdGenerator } from '../child-proxy/id-generator.js';
import { CheckerResource } from './checker-resource.js';
export declare class CheckerChildProcessProxy implements CheckerResource, Disposable, Resource {
    private readonly childProcess;
    constructor(options: StrykerOptions, fileDescriptions: FileDescriptions, pluginModulePaths: readonly string[], loggingContext: LoggingClientContext, idGenerator: IdGenerator);
    dispose(): Promise<void>;
    init(): Promise<void>;
    check(checkerName: string, mutants: Mutant[]): ReturnType<CheckerResource['check']>;
    group(checkerName: string, mutants: Mutant[]): ReturnType<CheckerResource['group']>;
}
//# sourceMappingURL=checker-child-process-proxy.d.ts.map