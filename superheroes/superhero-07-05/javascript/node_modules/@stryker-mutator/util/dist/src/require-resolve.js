import { createRequire } from 'module';
/**
 * Require a module from the current working directory (or a different base dir)
 * @see https://nodejs.org/api/modules.html#modules_require_resolve_paths_request
 */
export function requireResolve(id, from = process.cwd()) {
    const require = createRequire(import.meta.url);
    return require(resolveFromCwd(id, from));
}
/**
 * Resolves a module from the current working directory (or a different base dir)
 * @see https://nodejs.org/api/modules.html#modules_require_resolve_paths_request
 */
export function resolveFromCwd(id, cwd = process.cwd()) {
    const require = createRequire(import.meta.url);
    return require.resolve(id, { paths: [cwd] });
}
//# sourceMappingURL=require-resolve.js.map