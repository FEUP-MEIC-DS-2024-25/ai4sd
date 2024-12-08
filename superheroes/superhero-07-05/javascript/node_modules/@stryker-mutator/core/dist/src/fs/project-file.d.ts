import { FileDescription, MutateDescription } from '@stryker-mutator/api/core';
import { File } from '@stryker-mutator/instrumenter';
import { I } from '@stryker-mutator/util';
import { FileSystem } from './file-system.js';
/**
 * Represents a file inside the project under test.
 * Has utility methods to help with copying it to the sandbox, or backing it up (when `--inPlace` is active)
 *
 * Assumes utf-8 as encoding when reading/writing content.
 */
export declare class ProjectFile implements FileDescription {
    #private;
    private readonly fs;
    private readonly name;
    mutate: MutateDescription;
    constructor(fs: I<FileSystem>, name: string, mutate: MutateDescription);
    setContent(content: string): void;
    toInstrumenterFile(): Promise<File>;
    readContent(): Promise<string>;
    readOriginal(): Promise<string>;
    writeInPlace(): Promise<void>;
    writeToSandbox(sandboxDir: string): Promise<string>;
    backupTo(backupDir: string): Promise<string>;
    get hasChanges(): boolean;
}
//# sourceMappingURL=project-file.d.ts.map