import { MutantCoverage } from './mutant-coverage.js';
/**
 * Identifiers used when instrumenting the code
 */
export declare const INSTRUMENTER_CONSTANTS: Readonly<{
    readonly NAMESPACE: "__stryker__";
    readonly MUTATION_COVERAGE_OBJECT: "mutantCoverage";
    readonly ACTIVE_MUTANT: "activeMutant";
    readonly CURRENT_TEST_ID: "currentTestId";
    readonly HIT_COUNT: "hitCount";
    readonly HIT_LIMIT: "hitLimit";
    readonly ACTIVE_MUTANT_ENV_VARIABLE: "__STRYKER_ACTIVE_MUTANT__";
}>;
export interface InstrumenterContext {
    activeMutant?: string;
    currentTestId?: string;
    mutantCoverage?: MutantCoverage;
    hitCount?: number;
    hitLimit?: number;
}
//# sourceMappingURL=instrument.d.ts.map