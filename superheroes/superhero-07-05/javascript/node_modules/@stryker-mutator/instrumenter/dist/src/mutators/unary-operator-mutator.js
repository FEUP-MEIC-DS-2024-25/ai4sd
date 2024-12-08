import babel from '@babel/core';
import { deepCloneNode } from '../util/index.js';
const { types } = babel;
var UnaryOperator;
(function (UnaryOperator) {
    UnaryOperator["+"] = "-";
    UnaryOperator["-"] = "+";
    UnaryOperator["~"] = "";
})(UnaryOperator || (UnaryOperator = {}));
export const unaryOperatorMutator = {
    name: 'UnaryOperator',
    *mutate(path) {
        if (path.isUnaryExpression() && isSupported(path.node.operator) && path.node.prefix) {
            const mutatedOperator = UnaryOperator[path.node.operator];
            const replacement = mutatedOperator.length
                ? types.unaryExpression(mutatedOperator, deepCloneNode(path.node.argument))
                : deepCloneNode(path.node.argument);
            yield replacement;
        }
    },
};
function isSupported(operator) {
    return Object.keys(UnaryOperator).includes(operator);
}
//# sourceMappingURL=unary-operator-mutator.js.map