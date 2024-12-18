import type { Location, MutantResult, MutantStatus } from 'mutation-testing-report-schema';
import type { FileUnderTestModel } from './file-under-test-model.js';
import type { TestModel } from './test-model.js';
/**
 * Represent a model of a mutant that contains its test relationship
 */
export declare class MutantModel implements MutantResult {
    #private;
    coveredBy: string[] | undefined;
    description: string | undefined;
    duration: number | undefined;
    id: string;
    killedBy: string[] | undefined;
    location: Location;
    mutatorName: string;
    replacement: string | undefined;
    static: boolean | undefined;
    status: MutantStatus;
    statusReason: string | undefined;
    testsCompleted: number | undefined;
    get coveredByTests(): TestModel[] | undefined;
    set coveredByTests(tests: TestModel[]);
    get killedByTests(): TestModel[] | undefined;
    set killedByTests(tests: TestModel[]);
    sourceFile: FileUnderTestModel | undefined;
    constructor(input: MutantResult);
    addCoveredBy(test: TestModel): void;
    addKilledBy(test: TestModel): void;
    /**
     * Retrieves the lines of code with the mutant applied to it, to be shown in a diff view.
     */
    getMutatedLines(): string;
    /**
     * Retrieves the original source lines for this mutant, to be shown in a diff view.
     */
    getOriginalLines(): string;
    /**
     * Helper property to retrieve the source file name
     * @throws When the `sourceFile` is not defined.
     */
    get fileName(): string;
    update(): void;
}
//# sourceMappingURL=mutant-model.d.ts.map