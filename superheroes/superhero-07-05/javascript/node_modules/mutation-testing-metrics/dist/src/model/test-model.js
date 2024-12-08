function assertSourceFileDefined(sourceFile) {
    if (sourceFile === undefined) {
        throw new Error('test.sourceFile was not defined');
    }
}
function assertLocationDefined(location) {
    if (location === undefined) {
        throw new Error('test.location was not defined');
    }
}
export var TestStatus;
(function (TestStatus) {
    TestStatus["Killing"] = "Killing";
    TestStatus["Covering"] = "Covering";
    TestStatus["NotCovering"] = "NotCovering";
})(TestStatus || (TestStatus = {}));
export class TestModel {
    id;
    name;
    location;
    get killedMutants() {
        if (this.#killedMutants.size) {
            return Array.from(this.#killedMutants.values());
        }
        else
            return undefined;
    }
    get coveredMutants() {
        if (this.#coveredMutants.size) {
            return Array.from(this.#coveredMutants.values());
        }
        else
            return undefined;
    }
    #killedMutants = new Map();
    #coveredMutants = new Map();
    addCovered(mutant) {
        this.#coveredMutants.set(mutant.id, mutant);
    }
    addKilled(mutant) {
        this.#killedMutants.set(mutant.id, mutant);
    }
    constructor(input) {
        Object.entries(input).forEach(([key, value]) => {
            // @ts-expect-error dynamic assignment so we won't forget to add new properties
            this[key] = value;
        });
    }
    /**
     * Retrieves the original source lines where this test is defined.
     * @throws if source file or location is not defined
     */
    getLines() {
        assertSourceFileDefined(this.sourceFile);
        assertLocationDefined(this.location);
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
    get status() {
        if (this.#killedMutants.size) {
            return TestStatus.Killing;
        }
        else if (this.#coveredMutants.size) {
            return TestStatus.Covering;
        }
        else {
            return TestStatus.NotCovering;
        }
    }
    update() {
        if (!this.sourceFile?.result?.file) {
            return;
        }
        this.sourceFile.result.updateAllMetrics();
    }
}
//# sourceMappingURL=test-model.js.map