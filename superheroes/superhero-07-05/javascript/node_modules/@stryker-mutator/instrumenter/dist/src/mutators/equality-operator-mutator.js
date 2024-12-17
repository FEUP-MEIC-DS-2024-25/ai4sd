import babel from '@babel/core';
const { types: t } = babel;
const operators = {
    '<': ['<=', '>='],
    '<=': ['<', '>'],
    '>': ['>=', '<='],
    '>=': ['>', '<'],
    '==': ['!='],
    '!=': ['=='],
    '===': ['!=='],
    '!==': ['==='],
};
function isEqualityOperator(operator) {
    return Object.keys(operators).includes(operator);
}
export const equalityOperatorMutator = {
    name: 'EqualityOperator',
    *mutate(path) {
        if (path.isBinaryExpression() && isEqualityOperator(path.node.operator)) {
            for (const mutableOperator of operators[path.node.operator]) {
                const replacement = t.cloneNode(path.node, true);
                replacement.operator = mutableOperator;
                yield replacement;
            }
        }
    },
};
//# sourceMappingURL=equality-operator-mutator.js.map