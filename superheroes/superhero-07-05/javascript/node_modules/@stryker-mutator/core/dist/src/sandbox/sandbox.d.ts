import type { execaCommand } from 'execa';
import { StrykerOptions } from '@stryker-mutator/api/core';
import { I } from '@stryker-mutator/util';
import { Logger } from '@stryker-mutator/api/logging';
import { Disposable } from '@stryker-mutator/api/plugin';
import { TemporaryDirectory } from '../utils/temporary-directory.js';
import { UnexpectedExitHandler } from '../unexpected-exit-handler.js';
import { Project } from '../fs/project.js';
export declare class Sandbox implements Disposable {
    private readonly options;
    private readonly log;
    private readonly temporaryDirectory;
    private readonly project;
    private readonly execCommand;
    private readonly fileMap;
    /**
     * The working directory for this sandbox
     * Either an actual sandbox directory, or the cwd when running in --inPlace mode
     */
    readonly workingDirectory: string;
    /**
     * The backup directory when running in --inPlace mode
     */
    private readonly backupDirectory;
    /**
     * The sandbox dir or the backup dir when running in `--inPlace` mode
     */
    private readonly tempDirectory;
    static readonly inject: ["options", "logger", "temporaryDirectory", "project", "execa", "unexpectedExitRegistry"];
    constructor(options: StrykerOptions, log: Logger, temporaryDirectory: I<TemporaryDirectory>, project: Project, execCommand: typeof execaCommand, unexpectedExitHandler: I<UnexpectedExitHandler>);
    init(): Promise<void>;
    sandboxFileFor(fileName: string): string;
    originalFileFor(sandboxFileName: string): string;
    private fillSandbox;
    private runBuildCommand;
    private symlinkNodeModulesIfNeeded;
    /**
     * Sandboxes a file (writes it to the sandbox). Either in-place, or an actual sandbox directory.
     * @param name The name of the file
     * @param file The file reference
     */
    private sandboxFile;
    dispose(unexpected?: boolean): void;
}
//# sourceMappingURL=sandbox.d.ts.map