import babel from '@babel/core';
import { mutantTestExpression, mutationCoverageSequenceExpression } from '../util/syntax-helpers.js';
const { types: t } = babel;
/**
 * Mutant placer that places mutants in statements that allow it.
 * It uses an `if` statement to do so
 */
export const statementMutantPlacer = {
    name: 'statementMutantPlacer',
    canPlace(path) {
        return path.isStatement();
    },
    place(path, appliedMutants) {
        let statement = t.blockStatement([
            t.expressionStatement(mutationCoverageSequenceExpression(appliedMutants.keys())),
            ...(path.isBlockStatement() ? path.node.body : [path.node]),
        ]);
        for (const [mutant, appliedMutant] of appliedMutants) {
            statement = t.ifStatement(mutantTestExpression(mutant.id), t.blockStatement([appliedMutant]), statement);
        }
        path.replaceWith(path.isBlockStatement() ? t.blockStatement([statement]) : statement);
    },
};
//# sourceMappingURL=statement-mutant-placer.js.map