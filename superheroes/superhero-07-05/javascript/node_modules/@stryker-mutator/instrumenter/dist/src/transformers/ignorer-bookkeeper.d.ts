import type { NodePath as BabelNodePath } from '@babel/core';
import type { Ignorer } from '@stryker-mutator/api/ignore';
declare module '@stryker-mutator/api/ignore' {
    interface NodePath extends BabelNodePath {
    }
}
/**
 * Responsible for keeping track of the active ignore message and node using the configured ignore-plugins.
 */
export declare class IgnorerBookkeeper {
    private readonly ignorers;
    private activeIgnored?;
    get currentIgnoreMessage(): string | undefined;
    constructor(ignorers: Ignorer[]);
    enterNode(path: BabelNodePath): void;
    leaveNode(path: BabelNodePath): void;
}
//# sourceMappingURL=ignorer-bookkeeper.d.ts.map