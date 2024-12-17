import { StrykerOptions } from '@stryker-mutator/api/core';
import { Observable } from 'rxjs';
import { Disposable } from 'typed-inject';
import { Logger } from '@stryker-mutator/api/logging';
export declare class ConcurrencyTokenProvider implements Disposable {
    private readonly log;
    private readonly concurrencyCheckers;
    private readonly concurrencyTestRunners;
    private readonly testRunnerTokenSubject;
    get testRunnerToken$(): Observable<number>;
    readonly checkerToken$: Observable<number>;
    static readonly inject: ["options", "logger"];
    constructor(options: Pick<StrykerOptions, 'checkers' | 'concurrency'>, log: Logger);
    freeCheckers(): void;
    private count;
    private tick;
    dispose(): void;
}
//# sourceMappingURL=concurrency-token-provider.d.ts.map