export class ResourceDecorator {
    producer;
    innerResource;
    constructor(producer) {
        this.producer = producer;
        this.innerResource = producer();
    }
    async init() {
        await this.innerResource.init?.();
    }
    async dispose() {
        await this.innerResource.dispose?.();
    }
    /**
     * Disposes the current test runner and creates a new one
     * To be used in decorators that need recreation.
     */
    async recover() {
        await this.dispose();
        this.innerResource = this.producer();
        return this.init();
    }
}
//# sourceMappingURL=resource-decorator.js.map