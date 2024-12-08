import { TestRunnerDecorator } from './test-runner-decorator.js';
/**
 * Wraps a test runner and implements the retry functionality.
 */
export class MaxTestRunnerReuseDecorator extends TestRunnerDecorator {
    runs = 0;
    restartAfter;
    constructor(testRunnerProducer, options) {
        super(testRunnerProducer);
        this.restartAfter = options.maxTestRunnerReuse || 0;
    }
    async mutantRun(options) {
        this.runs++;
        if (this.restartAfter > 0 && this.runs > this.restartAfter) {
            await this.recover();
            this.runs = 1;
        }
        return super.mutantRun(options);
    }
    dispose() {
        this.runs = 0;
        return super.dispose();
    }
}
//# sourceMappingURL=max-test-runner-reuse-decorator.js.map