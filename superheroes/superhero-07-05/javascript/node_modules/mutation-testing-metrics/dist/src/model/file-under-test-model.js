import { MutantModel } from './mutant-model.js';
import { SourceFile } from './source-file.js';
/**
 * Represents a file which was mutated (your production code).
 */
export class FileUnderTestModel extends SourceFile {
    name;
    /**
     * Programming language that is used. Used for code highlighting, see https://prismjs.com/#examples.
     */
    language;
    /**
     * Full source code of the mutated file, this is used for highlighting.
     */
    source;
    /**
     * The mutants inside this file.
     */
    mutants;
    /**
     * The associated MetricsResult of this file.
     */
    result;
    /**
     * @param input The file result content
     * @param name The file name
     */
    constructor(input, name) {
        super();
        this.name = name;
        this.language = input.language;
        this.source = input.source;
        this.mutants = input.mutants.map((mutantResult) => {
            const mutant = new MutantModel(mutantResult);
            mutant.sourceFile = this;
            return mutant;
        });
    }
    /**
     * Retrieves the lines of code with the mutant applied to it, to be shown in a diff view.
     */
    getMutationLines(mutant) {
        const lineMap = this.getLineMap();
        const start = lineMap[mutant.location.start.line];
        const startOfEndLine = lineMap[mutant.location.end.line];
        const end = lineMap[mutant.location.end.line + 1];
        return `${this.source.substr(start, mutant.location.start.column - 1)}${mutant.replacement ?? mutant.description ?? mutant.mutatorName}${this.source.substring(startOfEndLine + mutant.location.end.column - 1, end)}`;
    }
}
//# sourceMappingURL=file-under-test-model.js.map