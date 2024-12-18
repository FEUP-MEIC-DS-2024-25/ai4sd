import { deepCloneNode } from '../util/index.js';
const logicalOperatorReplacements = Object.freeze({
    '&&': '||',
    '||': '&&',
    '??': '&&',
});
export const logicalOperatorMutator = {
    name: 'LogicalOperator',
    *mutate(path) {
        if (path.isLogicalExpression() && isSupported(path.node.operator)) {
            const mutatedOperator = logicalOperatorReplacements[path.node.operator];
            const replacement = deepCloneNode(path.node);
            replacement.operator = mutatedOperator;
            yield replacement;
        }
    },
};
function isSupported(operator) {
    return Object.keys(logicalOperatorReplacements).includes(operator);
}
//# sourceMappingURL=logical-operator-mutator.js.map