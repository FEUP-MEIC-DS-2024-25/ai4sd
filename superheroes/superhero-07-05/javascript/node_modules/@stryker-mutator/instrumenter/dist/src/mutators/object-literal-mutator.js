import babel from '@babel/core';
const { types } = babel;
export const objectLiteralMutator = {
    name: 'ObjectLiteral',
    *mutate(path) {
        if (path.isObjectExpression() && path.node.properties.length > 0) {
            yield types.objectExpression([]);
        }
    },
};
//# sourceMappingURL=object-literal-mutator.js.map