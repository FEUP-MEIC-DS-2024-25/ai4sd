import { Resource } from './pool.js';
export declare abstract class ResourceDecorator<T extends Resource> implements Resource {
    private readonly producer;
    protected innerResource: T;
    constructor(producer: () => T);
    init(): Promise<void>;
    dispose(): Promise<void>;
    /**
     * Disposes the current test runner and creates a new one
     * To be used in decorators that need recreation.
     */
    protected recover(): Promise<void>;
}
//# sourceMappingURL=resource-decorator.d.ts.map