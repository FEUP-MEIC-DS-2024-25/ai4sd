import { KnownKeys } from './known-keys.js';
import { Primitive } from './primitive.js';
type OnlyObject<T> = Exclude<T, Primitive>;
/**
 * Consolidates multiple consecutive white spaces into a single space.
 * @param str The string to be normalized
 */
export declare function normalizeWhitespaces(str: string): string;
/**
 * Normalizes line endings as unix style.
 */
export declare function normalizeLineEndings(text: string): string;
export interface PropertyPathOverloads<T> {
    (key: KnownKeys<T>): string;
    <TProp1 extends KnownKeys<T>>(key: TProp1, key2: KnownKeys<OnlyObject<T[TProp1]>>): string;
    <TProp1 extends KnownKeys<T>, TProp2 extends KnownKeys<OnlyObject<T[TProp1]>>>(key: TProp1, key2: TProp2, key3: KnownKeys<OnlyObject<OnlyObject<T[TProp1]>[TProp2]>>): string;
}
/**
 * Given a base type, allows type safe access to the name of a property.
 * @param prop The property name
 */
export declare function propertyPath<T>(): PropertyPathOverloads<T>;
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
 */
export declare function escapeRegExpLiteral(input: string): string;
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
 */
export declare function escapeRegExp(input: string): string;
/**
 * Normalizes relative or absolute file names to be in posix format (forward slashes '/')
 */
export declare function normalizeFileName(fileName: string): string;
/**
 * Creates a URL to the page where you can report a bug.
 * @param titleSuggestion The title to be prefilled in.
 */
export declare function strykerReportBugUrl(titleSuggestion: string): string;
export {};
//# sourceMappingURL=string-utils.d.ts.map