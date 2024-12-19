import babel from '@babel/core';
import { deepCloneNode } from '../util/index.js';
const { types } = babel;
var UpdateOperators;
(function (UpdateOperators) {
    UpdateOperators["++"] = "--";
    UpdateOperators["--"] = "++";
})(UpdateOperators || (UpdateOperators = {}));
export const updateOperatorMutator = {
    name: 'UpdateOperator',
    *mutate(path) {
        if (path.isUpdateExpression()) {
            yield types.updateExpression(UpdateOperators[path.node.operator], deepCloneNode(path.node.argument), path.node.prefix);
        }
    },
};
//# sourceMappingURL=update-operator-mutator.js.map