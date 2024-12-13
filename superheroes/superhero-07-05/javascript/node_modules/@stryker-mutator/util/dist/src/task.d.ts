/**
 * Wraps a promise in a Task api for convenience.
 */
export declare class Task<T = void> {
    protected _promise: Promise<T>;
    private resolveFn;
    private rejectFn;
    private _isCompleted;
    constructor();
    get promise(): Promise<T>;
    get isCompleted(): boolean;
    resolve: (result: PromiseLike<T> | T) => void;
    reject: (reason: any) => void;
}
/**
 * A task that can expire after the given time.
 */
export declare class ExpirableTask<T = void> extends Task<T | typeof ExpirableTask.TimeoutExpired> {
    static readonly TimeoutExpired: unique symbol;
    constructor(timeoutMS: number);
    static timeout<K>(promise: Promise<K>, ms: number): Promise<K | typeof ExpirableTask.TimeoutExpired>;
}
//# sourceMappingURL=task.d.ts.map