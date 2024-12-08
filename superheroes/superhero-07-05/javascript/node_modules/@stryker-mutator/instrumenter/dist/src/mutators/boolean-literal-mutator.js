import babel from '@babel/core';
import { deepCloneNode } from '../util/index.js';
const { types } = babel;
export const booleanLiteralMutator = {
    name: 'BooleanLiteral',
    *mutate(path) {
        if (path.isBooleanLiteral()) {
            yield types.booleanLiteral(!path.node.value);
        }
        if (path.isUnaryExpression() && path.node.operator === '!' && path.node.prefix) {
            yield deepCloneNode(path.node.argument);
        }
    },
};
//# sourceMappingURL=boolean-literal-mutator.js.map