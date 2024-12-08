import { deepCloneNode } from '../util/index.js';
const arithmeticOperatorReplacements = Object.freeze({
    '+': '-',
    '-': '+',
    '*': '/',
    '/': '*',
    '%': '*',
});
export const arithmeticOperatorMutator = {
    name: 'ArithmeticOperator',
    *mutate(path) {
        if (path.isBinaryExpression() && isSupported(path.node.operator, path.node)) {
            const mutatedOperator = arithmeticOperatorReplacements[path.node.operator];
            const replacement = deepCloneNode(path.node);
            replacement.operator = mutatedOperator;
            yield replacement;
        }
    },
};
function isSupported(operator, node) {
    if (!Object.keys(arithmeticOperatorReplacements).includes(operator)) {
        return false;
    }
    const stringTypes = ['StringLiteral', 'TemplateLiteral'];
    const leftType = node.left.type === 'BinaryExpression' ? node.left.right.type : node.left.type;
    if (stringTypes.includes(node.right.type) || stringTypes.includes(leftType)) {
        return false;
    }
    return true;
}
//# sourceMappingURL=arithmetic-operator-mutator.js.map