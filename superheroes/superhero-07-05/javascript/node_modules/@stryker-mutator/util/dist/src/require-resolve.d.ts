/**
 * Require a module from the current working directory (or a different base dir)
 * @see https://nodejs.org/api/modules.html#modules_require_resolve_paths_request
 */
export declare function requireResolve(id: string, from?: string): unknown;
/**
 * Resolves a module from the current working directory (or a different base dir)
 * @see https://nodejs.org/api/modules.html#modules_require_resolve_paths_request
 */
export declare function resolveFromCwd(id: string, cwd?: string): string;
//# sourceMappingURL=require-resolve.d.ts.map