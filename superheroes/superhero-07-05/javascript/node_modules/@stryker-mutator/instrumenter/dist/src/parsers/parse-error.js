export class ParseError extends Error {
    constructor(message, fileName, location) {
        super(`Parse error in ${fileName} (${location.line}:${location.column}) ${message}`);
    }
}
//# sourceMappingURL=parse-error.js.map