import path from 'path';
import { minimatch } from 'minimatch';
import { normalizeFileName } from '@stryker-mutator/util';
/**
 * A helper class for matching files using the `disableTypeChecks` setting.
 */
export class FileMatcher {
    allowHiddenFiles;
    pattern;
    constructor(pattern, allowHiddenFiles = true) {
        this.allowHiddenFiles = allowHiddenFiles;
        if (typeof pattern === 'string') {
            this.pattern = normalizeFileName(path.resolve(pattern));
        }
        else if (pattern) {
            this.pattern = '**/*.{js,ts,jsx,tsx,html,vue,mjs,mts,cts,cjs}';
        }
        else {
            this.pattern = pattern;
        }
    }
    matches(fileName) {
        if (typeof this.pattern === 'string') {
            return minimatch(normalizeFileName(path.resolve(fileName)), this.pattern, { dot: this.allowHiddenFiles });
        }
        else {
            return this.pattern;
        }
    }
}
//# sourceMappingURL=file-matcher.js.map