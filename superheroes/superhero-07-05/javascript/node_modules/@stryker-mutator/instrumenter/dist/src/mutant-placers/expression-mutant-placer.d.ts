import babel from '@babel/core';
/**
 * Places the mutants with a conditional expression: `global.activeMutant === 1? mutatedCode : originalCode`;
 */
export declare const expressionMutantPlacer: {
    name: string;
    canPlace(path: babel.NodePath<babel.types.Node>): boolean;
    place(path: babel.NodePath<babel.types.Expression>, appliedMutants: Map<import("../mutant.js").Mutant, babel.types.Expression>): void;
};
//# sourceMappingURL=expression-mutant-placer.d.ts.map