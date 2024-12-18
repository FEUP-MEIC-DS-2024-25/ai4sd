import { LogLevel } from '@stryker-mutator/api/core';
import { LoggingClientContext } from './logging-client-context.js';
export declare class LogConfigurator {
    private static createMainProcessAppenders;
    private static createLog4jsConfig;
    /**
     * Configure logging for the master process. Either call this method or `configureChildProcess` before any `getLogger` calls.
     * @param consoleLogLevel The log level to configure for the console
     * @param fileLogLevel The log level to configure for the "stryker.log" file
     */
    static configureMainProcess(consoleLogLevel?: LogLevel, fileLogLevel?: LogLevel, allowConsoleColors?: boolean): void;
    /**
     * Configure the logging for the server. Includes the master configuration.
     * This method should only be called ONCE, as it starts the log4js server to listen for log events.
     * It returns the logging client context that should be used to configure the child processes.
     *
     * @param consoleLogLevel the console log level
     * @param fileLogLevel the file log level
     * @returns the context
     */
    static configureLoggingServer(consoleLogLevel: LogLevel, fileLogLevel: LogLevel, allowConsoleColors: boolean): Promise<LoggingClientContext>;
    /**
     * Configures the logging for a worker process. Sends all logging to the master process.
     * Either call this method or `configureMainProcess` before any `getLogger` calls.
     * @param context the logging client context used to configure the logging client
     */
    static configureChildProcess(context: LoggingClientContext): void;
    static shutdown(): Promise<void>;
}
//# sourceMappingURL=log-configurator.d.ts.map