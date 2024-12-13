import os from 'os';
import { ProgressKeeper } from './progress-keeper.js';
export class ProgressAppendOnlyReporter extends ProgressKeeper {
    intervalReference;
    onMutationTestingPlanReady(event) {
        super.onMutationTestingPlanReady(event);
        if (event.mutantPlans.length) {
            this.intervalReference = setInterval(() => this.render(), 10000);
        }
    }
    onMutationTestReportReady() {
        if (this.intervalReference) {
            clearInterval(this.intervalReference);
        }
    }
    render() {
        process.stdout.write(`Mutation testing ${this.getPercentDone()} (elapsed: ${this.getElapsedTime()}, remaining: ${this.getEtc()}) ` +
            `${this.progress.tested}/${this.progress.mutants} tested (${this.progress.survived} survived, ${this.progress.timedOut} timed out)` +
            os.EOL);
    }
    getPercentDone() {
        return `${Math.floor((this.progress.ticks / this.progress.total) * 100)}%`;
    }
}
//# sourceMappingURL=progress-append-only-reporter.js.map