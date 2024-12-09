/**
 * Wraps a promise in a Task api for convenience.
 */
export class Task {
    _promise;
    resolveFn;
    rejectFn;
    _isCompleted = false;
    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this.resolveFn = resolve;
            this.rejectFn = reject;
        });
    }
    get promise() {
        return this._promise;
    }
    get isCompleted() {
        return this._isCompleted;
    }
    resolve = (result) => {
        this._isCompleted = true;
        this.resolveFn(result);
    };
    reject = (reason) => {
        this._isCompleted = true;
        this.rejectFn(reason);
    };
}
/**
 * A task that can expire after the given time.
 */
export class ExpirableTask extends Task {
    static TimeoutExpired = Symbol('TimeoutExpired');
    constructor(timeoutMS) {
        super();
        this._promise = ExpirableTask.timeout(this._promise, timeoutMS);
    }
    static timeout(promise, ms) {
        const sleep = new Promise((res, rej) => {
            const timer = setTimeout(() => res(ExpirableTask.TimeoutExpired), ms);
            promise
                .then((result) => {
                clearTimeout(timer);
                res(result);
            })
                .catch((error) => {
                clearTimeout(timer);
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                rej(error);
            });
        });
        return sleep;
    }
}
//# sourceMappingURL=task.js.map