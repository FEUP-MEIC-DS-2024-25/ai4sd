import { type types } from '@babel/core';
import { Mutant as ApiMutant, Position } from '@stryker-mutator/api/core';
export interface Mutable {
    mutatorName: string;
    ignoreReason?: string;
    replacement: types.Node;
}
export declare class Mutant implements Mutable {
    readonly id: string;
    readonly fileName: string;
    readonly original: types.Node;
    readonly offset: Position;
    readonly replacementCode: string;
    readonly replacement: types.Node;
    readonly mutatorName: string;
    readonly ignoreReason: string | undefined;
    constructor(id: string, fileName: string, original: types.Node, specs: Mutable, offset?: Position);
    toApiMutant(): ApiMutant;
    /**
     * Applies the mutant in (a copy of) the AST, without changing provided AST.
     * Can the tree itself (in which case the replacement is returned),
     * or can be nested in the given tree.
     * @param originalTree The original node, which will be treated as readonly
     */
    applied<TNode extends types.Node>(originalTree: TNode): TNode;
}
//# sourceMappingURL=mutant.d.ts.map