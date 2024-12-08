import { Mutant } from '../mutant.js';
export class MutantCollector {
    _mutants = [];
    get mutants() {
        return this._mutants;
    }
    /**
     * Adds mutants to the internal mutant list.
     * @param fileName file name that houses the mutant
     * @param original The node to mutate
     * @param mutables the named node mutation to be added
     * @param contextPath the context where these mutants are found and should be placed as close by as possible
     * @param offset offset of mutant nodes
     * @returns The mutant (for testability)
     */
    collect(fileName, original, mutable, offset = { line: 0, column: 0 }) {
        const mutant = new Mutant(this._mutants.length.toString(), fileName, original, mutable, offset);
        this._mutants.push(mutant);
        return mutant;
    }
    hasPlacedMutants(fileName) {
        return this.mutants.some((mutant) => mutant.fileName === fileName && !mutant.ignoreReason);
    }
}
//# sourceMappingURL=mutant-collector.js.map