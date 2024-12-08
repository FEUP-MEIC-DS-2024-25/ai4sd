import babel from '@babel/core';
import { AstFormat } from '../syntax/index.js';
const { types, parseAsync } = babel;
const defaultPlugins = [
    'doExpressions',
    'objectRestSpread',
    'classProperties',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
    'numericSeparator',
    'importMeta',
    'optionalCatchBinding',
    'optionalChaining',
    'classPrivateProperties',
    ['pipelineOperator', { proposal: 'minimal' }],
    'nullishCoalescingOperator',
    'bigInt',
    'throwExpressions',
    'logicalAssignment',
    'classPrivateMethods',
    'v8intrinsic',
    'partialApplication',
    ['decorators', { decoratorsBeforeExport: false }],
    'jsx',
];
export function createParser({ plugins: pluginsOverride }) {
    return async function parse(text, fileName) {
        const ast = await parseAsync(text, {
            parserOpts: {
                plugins: [...(pluginsOverride ?? defaultPlugins)],
            },
            filename: fileName,
            sourceType: 'module',
        });
        if (types.isProgram(ast)) {
            throw new Error(`Expected ${fileName} to contain a babel.types.file, but was a program`);
        }
        return {
            originFileName: fileName,
            rawContent: text,
            format: AstFormat.JS,
            root: ast,
        };
    };
}
//# sourceMappingURL=js-parser.js.map