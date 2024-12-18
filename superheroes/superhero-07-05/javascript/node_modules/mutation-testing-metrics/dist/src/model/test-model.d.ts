import type { OpenEndLocation, TestDefinition } from 'mutation-testing-report-schema';
import type { MutantModel } from './mutant-model.js';
import type { TestFileModel } from './test-file-model.js';
export declare enum TestStatus {
    Killing = "Killing",
    Covering = "Covering",
    NotCovering = "NotCovering"
}
export declare class TestModel implements TestDefinition {
    #private;
    id: string;
    name: string;
    location?: OpenEndLocation | undefined;
    get killedMutants(): MutantModel[] | undefined;
    get coveredMutants(): MutantModel[] | undefined;
    sourceFile: TestFileModel | undefined;
    addCovered(mutant: MutantModel): void;
    addKilled(mutant: MutantModel): void;
    constructor(input: TestDefinition);
    /**
     * Retrieves the original source lines where this test is defined.
     * @throws if source file or location is not defined
     */
    getLines(): string;
    /**
     * Helper property to retrieve the source file name
     * @throws When the `sourceFile` is not defined.
     */
    get fileName(): string;
    get status(): TestStatus;
    update(): void;
}
//# sourceMappingURL=test-model.d.ts.map