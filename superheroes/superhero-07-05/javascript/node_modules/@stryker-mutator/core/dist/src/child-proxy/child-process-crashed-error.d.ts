import { StrykerError } from '@stryker-mutator/util';
export declare class ChildProcessCrashedError extends StrykerError {
    readonly pid: number | undefined;
    readonly exitCode?: number | undefined;
    readonly signal?: string | undefined;
    constructor(pid: number | undefined, message: string, exitCode?: number | undefined, signal?: string | undefined, innerError?: Error);
}
//# sourceMappingURL=child-process-crashed-error.d.ts.map