import { StrykerError } from '@stryker-mutator/util';
export class ChildProcessCrashedError extends StrykerError {
    pid;
    exitCode;
    signal;
    constructor(pid, message, exitCode, signal, innerError) {
        super(message, innerError);
        this.pid = pid;
        this.exitCode = exitCode;
        this.signal = signal;
        Error.captureStackTrace(this, ChildProcessCrashedError);
        // TS recommendation: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, ChildProcessCrashedError.prototype);
    }
}
//# sourceMappingURL=child-process-crashed-error.js.map