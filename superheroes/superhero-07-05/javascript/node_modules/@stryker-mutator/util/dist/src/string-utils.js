/**
 * Consolidates multiple consecutive white spaces into a single space.
 * @param str The string to be normalized
 */
export function normalizeWhitespaces(str) {
    return str.replace(/\s+/g, ' ').trim();
}
/**
 * Normalizes line endings as unix style.
 */
export function normalizeLineEndings(text) {
    return text.replace(/\r\n/g, '\n');
}
/**
 * Given a base type, allows type safe access to the name of a property.
 * @param prop The property name
 */
export function propertyPath() {
    const fn = ((...args) => args.join('.'));
    return fn;
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
 */
export function escapeRegExpLiteral(input) {
    return input.replace(/[.*+\-?^${}()|[\]\\/]/g, '\\$&'); // $& means the whole matched string
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
 */
export function escapeRegExp(input) {
    return input.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
/**
 * Normalizes relative or absolute file names to be in posix format (forward slashes '/')
 */
export function normalizeFileName(fileName) {
    return fileName.replace(/\\/g, '/');
}
/**
 * Creates a URL to the page where you can report a bug.
 * @param titleSuggestion The title to be prefilled in.
 */
export function strykerReportBugUrl(titleSuggestion) {
    return `https://github.com/stryker-mutator/stryker-js/issues/new?assignees=&labels=%F0%9F%90%9B+Bug&template=bug_report.md&title=${encodeURIComponent(titleSuggestion)}`;
}
//# sourceMappingURL=string-utils.js.map