import { FileDescriptions, StrykerOptions } from '@stryker-mutator/api/core';
import { LoggingClientContext } from '../logging/index.js';
export declare enum WorkerMessageKind {
    Init = 0,
    Call = 1,
    Dispose = 2
}
export declare enum ParentMessageKind {
    /**
     * Indicates that the child process is spawned and ready to receive messages
     */
    Ready = 0,
    /**
     * Indicates that initialization is done
     */
    Initialized = 1,
    /**
     * Indicates an error happened during initialization
     */
    InitError = 2,
    /**
     * Indicates that a 'Call' was successful
     */
    CallResult = 3,
    /**
     * Indicates that a 'Call' was rejected
     */
    CallRejection = 4,
    /**
     * Indicates that a 'Dispose' was completed
     */
    DisposeCompleted = 5
}
export type WorkerMessage = CallMessage | DisposeMessage | InitMessage;
export type ParentMessage = InitRejectionResult | RejectionResult | WorkResult | {
    kind: ParentMessageKind.DisposeCompleted | ParentMessageKind.Initialized | ParentMessageKind.Ready;
};
export interface InitMessage {
    kind: WorkerMessageKind.Init;
    loggingContext: LoggingClientContext;
    options: StrykerOptions;
    fileDescriptions: FileDescriptions;
    pluginModulePaths: readonly string[];
    workingDirectory: string;
    namedExport: string;
    modulePath: string;
}
export interface DisposeMessage {
    kind: WorkerMessageKind.Dispose;
}
export interface WorkResult {
    kind: ParentMessageKind.CallResult;
    correlationId: number;
    result: any;
}
export interface RejectionResult {
    kind: ParentMessageKind.CallRejection;
    correlationId: number;
    error: string;
}
export interface InitRejectionResult {
    kind: ParentMessageKind.InitError;
    error: string;
}
export interface CallMessage {
    correlationId: number;
    kind: WorkerMessageKind.Call;
    args: any[];
    methodName: string;
}
//# sourceMappingURL=message-protocol.d.ts.map