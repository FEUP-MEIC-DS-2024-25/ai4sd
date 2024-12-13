import { SourceFile } from './source-file.js';
import { TestModel } from './test-model.js';
/**
 * Represents a file that contains tests
 */
export class TestFileModel extends SourceFile {
    name;
    tests;
    source;
    /**
     * The associated MetricsResult of this file.
     */
    result;
    /**
     * @param input the test file content
     * @param name the file name
     */
    constructor(input, name) {
        super();
        this.name = name;
        this.source = input.source;
        this.tests = input.tests.map((testDefinition) => {
            const test = new TestModel(testDefinition);
            test.sourceFile = this;
            return test;
        });
    }
}
//# sourceMappingURL=test-file-model.js.map