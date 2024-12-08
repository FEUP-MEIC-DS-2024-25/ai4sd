import babel from '@babel/core';
import generate from '@babel/generator';
import { deepCloneNode, eqNode } from './util/index.js';
const { traverse } = babel;
const generator = generate.default;
export class Mutant {
    id;
    fileName;
    original;
    offset;
    replacementCode;
    replacement;
    mutatorName;
    ignoreReason;
    constructor(id, fileName, original, specs, offset = { column: 0, line: 0 }) {
        this.id = id;
        this.fileName = fileName;
        this.original = original;
        this.offset = offset;
        this.replacement = specs.replacement;
        this.mutatorName = specs.mutatorName;
        this.ignoreReason = specs.ignoreReason;
        this.replacementCode = generator(this.replacement).code;
    }
    toApiMutant() {
        return {
            fileName: this.fileName,
            id: this.id,
            location: toApiLocation(this.original.loc, this.offset),
            mutatorName: this.mutatorName,
            replacement: this.replacementCode,
            statusReason: this.ignoreReason,
            status: this.ignoreReason ? 'Ignored' : undefined,
        };
    }
    /**
     * Applies the mutant in (a copy of) the AST, without changing provided AST.
     * Can the tree itself (in which case the replacement is returned),
     * or can be nested in the given tree.
     * @param originalTree The original node, which will be treated as readonly
     */
    applied(originalTree) {
        if (originalTree === this.original) {
            return this.replacement;
        }
        else {
            const mutatedAst = deepCloneNode(originalTree);
            let applied = false;
            const { original, replacement } = this;
            traverse(mutatedAst, {
                noScope: true,
                enter(path) {
                    if (eqNode(path.node, original)) {
                        path.replaceWith(replacement);
                        path.stop();
                        applied = true;
                    }
                },
            });
            if (!applied) {
                throw new Error(`Could not apply mutant ${JSON.stringify(this.replacement)}.`);
            }
            return mutatedAst;
        }
    }
}
function toApiLocation(source, offset) {
    const loc = {
        start: toPosition(source.start, offset),
        end: toPosition(source.end, offset),
    };
    return loc;
}
function toPosition(source, offset) {
    return {
        column: source.column + (source.line === 1 ? offset.column : 0), // offset is zero-based
        line: source.line + offset.line - 1, // Stryker works 0-based internally, offset is zero based as well
    };
}
//# sourceMappingURL=mutant.js.map