import { ResourceDecorator } from '../concurrent/index.js';
export class TestRunnerDecorator extends ResourceDecorator {
    async capabilities() {
        return this.innerResource.capabilities();
    }
    dryRun(options) {
        return this.innerResource.dryRun(options);
    }
    mutantRun(options) {
        return this.innerResource.mutantRun(options);
    }
}
//# sourceMappingURL=test-runner-decorator.js.map