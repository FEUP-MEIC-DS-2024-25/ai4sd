import { deepCloneNode } from '../util/index.js';
const assignmentOperatorReplacements = Object.freeze({
    '+=': '-=',
    '-=': '+=',
    '*=': '/=',
    '/=': '*=',
    '%=': '*=',
    '<<=': '>>=',
    '>>=': '<<=',
    '&=': '|=',
    '|=': '&=',
    '&&=': '||=',
    '||=': '&&=',
    '??=': '&&=',
});
const stringTypes = Object.freeze(['StringLiteral', 'TemplateLiteral']);
const stringAssignmentTypes = Object.freeze(['&&=', '||=', '??=']);
export const assignmentOperatorMutator = {
    name: 'AssignmentOperator',
    *mutate(path) {
        if (path.isAssignmentExpression() && isSupportedAssignmentOperator(path.node.operator) && isSupported(path.node)) {
            const mutatedOperator = assignmentOperatorReplacements[path.node.operator];
            const replacement = deepCloneNode(path.node);
            replacement.operator = mutatedOperator;
            yield replacement;
        }
    },
};
function isSupportedAssignmentOperator(operator) {
    return Object.keys(assignmentOperatorReplacements).includes(operator);
}
function isSupported(node) {
    // Excludes assignment operators that apply to strings.
    if (stringTypes.includes(node.right.type) && !stringAssignmentTypes.includes(node.operator)) {
        return false;
    }
    return true;
}
//# sourceMappingURL=assignment-operator-mutator.js.map