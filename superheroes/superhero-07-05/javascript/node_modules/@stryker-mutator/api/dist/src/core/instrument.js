/**
 * Identifiers used when instrumenting the code
 */
export const INSTRUMENTER_CONSTANTS = Object.freeze({
    NAMESPACE: '__stryker__',
    MUTATION_COVERAGE_OBJECT: identity('mutantCoverage'),
    ACTIVE_MUTANT: identity('activeMutant'),
    CURRENT_TEST_ID: identity('currentTestId'),
    HIT_COUNT: identity('hitCount'),
    HIT_LIMIT: identity('hitLimit'),
    ACTIVE_MUTANT_ENV_VARIABLE: '__STRYKER_ACTIVE_MUTANT__',
});
function identity(key) {
    return key;
}
//# sourceMappingURL=instrument.js.map