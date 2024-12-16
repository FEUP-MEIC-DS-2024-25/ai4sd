import { StrykerOptions } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { I } from '@stryker-mutator/util';
import { Project } from './project.js';
import { FileSystem } from './file-system.js';
export declare const IGNORE_PATTERN_CHARACTER = "!";
/**
 * @see https://stryker-mutator.io/docs/stryker-js/configuration/#mutate-string
 * @example
 * * "src/app.js:1-11" will mutate lines 1 through 11 inside app.js.
 * * "src/app.js:5:4-6:4" will mutate from line 5, column 4 through line 6 column 4 inside app.js (columns 4 are included).
 * * "src/app.js:5-6:4" will mutate from line 5, column 0 through line 6 column 4 inside app.js (column 4 is included).
 */
export declare const MUTATION_RANGE_REGEX: RegExp;
export declare class ProjectReader {
    private readonly fs;
    private readonly log;
    private readonly mutatePatterns;
    private readonly ignoreRules;
    private readonly incremental;
    private readonly force;
    private readonly incrementalFile;
    static inject: ["fs", "logger", "options"];
    constructor(fs: I<FileSystem>, log: Logger, { mutate, tempDirName, ignorePatterns, incremental, incrementalFile, force, htmlReporter, jsonReporter }: StrykerOptions);
    read(): Promise<Project>;
    /**
     * Takes the list of file names and creates file description object from it, containing logic about wether or not it needs to be mutated.
     * If a mutate pattern starts with a `!`, it negates the pattern.
     * @param inputFileNames the file names to filter
     */
    private resolveFileDescriptions;
    private mergeFileDescriptions;
    /**
     * Filters a given list of file names given a mutate pattern.
     * @param fileNames the file names to match to the pattern
     * @param mutatePattern the pattern to match with
     */
    private filterMutatePattern;
    private resolveInputFileNames;
    private readIncrementalReport;
}
//# sourceMappingURL=project-reader.d.ts.map