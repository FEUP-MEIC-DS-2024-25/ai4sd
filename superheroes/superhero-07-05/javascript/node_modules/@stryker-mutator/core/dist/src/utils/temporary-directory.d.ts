import { StrykerOptions } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { Disposable } from 'typed-inject';
export declare class TemporaryDirectory implements Disposable {
    private readonly log;
    private readonly temporaryDirectory;
    private isInitialized;
    removeDuringDisposal: boolean;
    static readonly inject: ["logger", "options"];
    constructor(log: Logger, options: StrykerOptions);
    initialize(): Promise<void>;
    getRandomDirectory(prefix: string): string;
    /**
     * Creates a new random directory with the specified prefix.
     * @returns The path to the directory.
     */
    createDirectory(name: string): Promise<void>;
    /**
     * Deletes the Stryker-temp directory
     */
    dispose(): Promise<void>;
}
//# sourceMappingURL=temporary-directory.d.ts.map