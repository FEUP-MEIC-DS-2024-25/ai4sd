import fs from 'fs';
import { Disposable } from 'typed-inject';
/**
 * A wrapper around nodejs's 'fs' core module, for dependency injection purposes.
 *
 * Also has build-in buffering support with a concurrency limit (like "graceful-fs").
 */
export declare class FileSystem implements Disposable {
    private readonly todoSubject;
    private readonly subscription;
    dispose(): void;
    readonly readFile: typeof fs.promises.readFile;
    readonly copyFile: typeof fs.promises.copyFile;
    readonly writeFile: typeof fs.promises.writeFile;
    readonly mkdir: typeof fs.promises.mkdir;
    readonly readdir: typeof fs.promises.readdir;
    private forward;
}
//# sourceMappingURL=file-system.d.ts.map