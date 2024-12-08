import type { types } from '@babel/core';
import { Position } from '@stryker-mutator/api/core';
import { Mutant, Mutable } from '../mutant.js';
export declare class MutantCollector {
    private readonly _mutants;
    get mutants(): readonly Mutant[];
    /**
     * Adds mutants to the internal mutant list.
     * @param fileName file name that houses the mutant
     * @param original The node to mutate
     * @param mutables the named node mutation to be added
     * @param contextPath the context where these mutants are found and should be placed as close by as possible
     * @param offset offset of mutant nodes
     * @returns The mutant (for testability)
     */
    collect(fileName: string, original: types.Node, mutable: Mutable, offset?: Position): Mutant;
    hasPlacedMutants(fileName: string): boolean;
}
//# sourceMappingURL=mutant-collector.d.ts.map