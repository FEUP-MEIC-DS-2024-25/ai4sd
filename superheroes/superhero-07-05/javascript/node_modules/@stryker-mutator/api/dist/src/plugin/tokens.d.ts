/**
 * Common tokens used for dependency injection (see typed-inject readme for more information)
 */
export declare const commonTokens: Readonly<{
    getLogger: "getLogger";
    injector: "$injector";
    logger: "logger";
    options: "options";
    fileDescriptions: "fileDescriptions";
    target: "$target";
}>;
/**
 * Helper method to create string literal tuple type.
 * @example
 * ```ts
 * const inject = tokens('foo', 'bar');
 * const inject2: ['foo', 'bar'] = ['foo', 'bar'];
 * ```
 * @param tokens The tokens as args
 */
export declare function tokens<TS extends string[]>(...tokensList: TS): TS;
//# sourceMappingURL=tokens.d.ts.map