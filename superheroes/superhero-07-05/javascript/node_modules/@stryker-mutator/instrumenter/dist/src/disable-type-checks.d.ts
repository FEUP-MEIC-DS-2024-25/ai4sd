import { File } from './file.js';
import { ParserOptions } from './parsers/index.js';
/**
 * Disables TypeScript type checking for a single file by inserting `// @ts-nocheck` commands.
 * It also does this for *.js files, as they can be type checked by typescript as well.
 * Other file types are silently ignored
 *
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#-ts-nocheck-in-typescript-files
 */
export declare function disableTypeChecks(file: File, options: ParserOptions): Promise<File>;
//# sourceMappingURL=disable-type-checks.d.ts.map