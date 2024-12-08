import { TestRunner } from '@stryker-mutator/api/test-runner';
import { Observable } from 'rxjs';
import { Disposable } from 'typed-inject';
import { CheckerFacade } from '../checker/index.js';
/**
 * Represents a TestRunner that is also a Resource (with an init and dispose)
 */
export type TestRunnerResource = Resource & TestRunner;
export interface Resource extends Partial<Disposable> {
    init?(): Promise<void>;
}
export declare function createTestRunnerPool(factory: () => TestRunnerResource, concurrencyToken$: Observable<number>): Pool<TestRunner>;
export declare namespace createTestRunnerPool {
    var inject: ["testRunnerFactory", "testRunnerConcurrencyTokens"];
}
export declare function createCheckerPool(factory: () => CheckerFacade, concurrencyToken$: Observable<number>): Pool<CheckerFacade>;
export declare namespace createCheckerPool {
    var inject: ["checkerFactory", "checkerConcurrencyTokens"];
}
/**
 * Represents a pool of resources. Use `schedule` to schedule work to be executed on the resources.
 * The pool will automatically recycle the resources, but will make sure only one task is executed
 * on one resource at any one time. Creates as many resources as the concurrency tokens allow.
 * Also takes care of the initialing of the resources (with `init()`)
 */
export declare class Pool<TResource extends Resource> implements Disposable {
    private readonly initSubject;
    private readonly disposedSubject;
    private readonly dispose$;
    private readonly createdResources;
    private readonly todoSubject;
    constructor(factory: () => TResource, concurrencyToken$: Observable<number>);
    /**
     * Returns a promise that resolves if all concurrency tokens have resulted in initialized resources.
     * This is optional, resources will get initialized either way.
     */
    init(): Promise<void>;
    /**
     * Schedules a task to be executed on resources in the pool. Each input is paired with a resource, which allows async work to be done.
     * @param input$ The inputs to pair up with a resource.
     * @param task The task to execute on each resource
     */
    schedule<TIn, TOut>(input$: Observable<TIn>, task: (resource: TResource, input: TIn) => Promise<TOut> | TOut): Observable<TOut>;
    /**
     * Dispose the pool
     */
    dispose(): Promise<void>;
}
//# sourceMappingURL=pool.d.ts.map