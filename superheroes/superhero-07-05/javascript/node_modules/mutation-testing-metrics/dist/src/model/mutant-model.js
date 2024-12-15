function assertSourceFileDefined(sourceFile) {
    if (sourceFile === undefined) {
        throw new Error('mutant.sourceFile was not defined');
    }
}
/**
 * Represent a model of a mutant that contains its test relationship
 */
export class MutantModel {
    // MutantResult properties
    coveredBy;
    description;
    duration;
    id;
    killedBy;
    location;
    mutatorName;
    replacement;
    static;
    status;
    statusReason;
    testsCompleted;
    // New fields
    get coveredByTests() {
        if (this.#coveredByTests.size) {
            return Array.from(this.#coveredByTests.values());
        }
        else
            return undefined;
    }
    set coveredByTests(tests) {
        this.#coveredByTests = new Map(tests.map((test) => [test.id, test]));
    }
    get killedByTests() {
        if (this.#killedByTests.size) {
            return Array.from(this.#killedByTests.values());
        }
        else
            return undefined;
    }
    set killedByTests(tests) {
        this.#killedByTests = new Map(tests.map((test) => [test.id, test]));
    }
    #coveredByTests = new Map();
    #killedByTests = new Map();
    constructor(input) {
        this.coveredBy = input.coveredBy;
        this.description = input.description;
        this.duration = input.duration;
        this.id = input.id;
        this.killedBy = input.killedBy;
        this.location = input.location;
        this.mutatorName = input.mutatorName;
        this.replacement = input.replacement;
        this.static = input.static;
        this.status = input.status;
        this.statusReason = input.statusReason;
        this.testsCompleted = input.testsCompleted;
    }
    addCoveredBy(test) {
        this.#coveredByTests.set(test.id, test);
    }
    addKilledBy(test) {
        this.#killedByTests.set(test.id, test);
    }
    /**
     * Retrieves the lines of code with the mutant applied to it, to be shown in a diff view.
     */
    getMutatedLines() {
        assertSourceFileDefined(this.sourceFile);
        return this.sourceFile.getMutationLines(this);
    }
    /**
     * Retrieves the original source lines for this mutant, to be shown in a diff view.
     */
    getOriginalLines() {
        assertSourceFileDefined(this.sourceFile);
        return this.sourceFile.getLines(this.location);
    }
    /**
     * Helper property to retrieve the source file name
     * @throws When the `sourceFile` is not defined.
     */
    get fileName() {
        assertSourceFileDefined(this.sourceFile);
        return this.sourceFile.name;
    }
    // TODO: https://github.com/stryker-mutator/mutation-testing-elements/pull/2453#discussion_r1178769871
    update() {
        if (!this.sourceFile?.result?.file) {
            return;
        }
        this.sourceFile.result.updateAllMetrics();
    }
}
//# sourceMappingURL=mutant-model.js.map