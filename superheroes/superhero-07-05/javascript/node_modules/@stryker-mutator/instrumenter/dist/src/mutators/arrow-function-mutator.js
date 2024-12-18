import babel from '@babel/core';
const { types } = babel;
export const arrowFunctionMutator = {
    name: 'ArrowFunction',
    *mutate(path) {
        if (path.isArrowFunctionExpression() &&
            !types.isBlockStatement(path.node.body) &&
            !(types.isIdentifier(path.node.body) && path.node.body.name === 'undefined')) {
            yield types.arrowFunctionExpression([], types.identifier('undefined'));
        }
    },
};
//# sourceMappingURL=arrow-function-mutator.js.map