import fs from 'fs';
import { Task } from '@stryker-mutator/util';
import { mergeMap, Subject } from 'rxjs';
const MAX_CONCURRENT_FILE_IO = 256;
class FileSystemAction {
    work;
    task = new Task();
    /**
     * @param work The task, where a resource and input is presented
     */
    constructor(work) {
        this.work = work;
    }
    async execute() {
        try {
            const output = await this.work();
            this.task.resolve(output);
        }
        catch (err) {
            this.task.reject(err);
        }
    }
}
/**
 * A wrapper around nodejs's 'fs' core module, for dependency injection purposes.
 *
 * Also has build-in buffering support with a concurrency limit (like "graceful-fs").
 */
export class FileSystem {
    todoSubject = new Subject();
    subscription = this.todoSubject
        .pipe(mergeMap(async (action) => {
        await action.execute();
    }, MAX_CONCURRENT_FILE_IO))
        .subscribe();
    dispose() {
        this.subscription.unsubscribe();
    }
    readFile = this.forward('readFile');
    copyFile = this.forward('copyFile');
    writeFile = this.forward('writeFile');
    mkdir = this.forward('mkdir');
    readdir = this.forward('readdir');
    forward(method) {
        return (...args) => {
            const action = new FileSystemAction(() => fs.promises[method](...args));
            this.todoSubject.next(action);
            return action.task.promise;
        };
    }
}
//# sourceMappingURL=file-system.js.map