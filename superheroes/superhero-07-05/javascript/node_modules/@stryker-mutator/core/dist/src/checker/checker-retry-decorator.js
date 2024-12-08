import { ChildProcessCrashedError } from '../child-proxy/child-process-crashed-error.js';
import { OutOfMemoryError } from '../child-proxy/out-of-memory-error.js';
import { ResourceDecorator } from '../concurrent/index.js';
export class CheckerRetryDecorator extends ResourceDecorator {
    log;
    constructor(producer, log) {
        super(producer);
        this.log = log;
    }
    async check(checkerName, mutants) {
        return this.tryAction(() => this.innerResource.check(checkerName, mutants));
    }
    async group(checkerName, mutants) {
        return this.tryAction(() => this.innerResource.group(checkerName, mutants));
    }
    async tryAction(act) {
        try {
            return await act();
        }
        catch (error) {
            if (error instanceof ChildProcessCrashedError) {
                if (error instanceof OutOfMemoryError) {
                    this.log.warn(`Checker process [${error.pid}] ran out of memory. Retrying in a new process.`);
                }
                else {
                    this.log.warn(`Checker process [${error.pid}] crashed with exit code ${error.exitCode}. Retrying in a new process.`, error);
                }
                await this.recover();
                return act();
            }
            else {
                throw error; //oops
            }
        }
    }
}
//# sourceMappingURL=checker-retry-decorator.js.map