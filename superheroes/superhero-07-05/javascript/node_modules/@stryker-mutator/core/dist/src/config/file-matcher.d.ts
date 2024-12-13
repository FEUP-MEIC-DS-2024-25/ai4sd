/**
 * A helper class for matching files using the `disableTypeChecks` setting.
 */
export declare class FileMatcher {
    private readonly allowHiddenFiles;
    private readonly pattern;
    constructor(pattern: boolean | string, allowHiddenFiles?: boolean);
    matches(fileName: string): boolean;
}
//# sourceMappingURL=file-matcher.d.ts.map