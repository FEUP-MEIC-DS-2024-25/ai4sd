import type { types } from '@babel/core';
import { Logger } from '@stryker-mutator/api/logging';
import { NodeMutator } from '../mutators/node-mutator.js';
/**
 * Responsible for the bookkeeping of "// Stryker" directives like "disable" and "restore".
 */
export declare class DirectiveBookkeeper {
    private readonly logger;
    private readonly allMutators;
    private readonly originFileName;
    private readonly strykerCommentDirectiveRegex;
    private currentIgnoreRule;
    private readonly allMutatorNames;
    constructor(logger: Logger, allMutators: NodeMutator[], originFileName: string);
    processStrykerDirectives({ loc, leadingComments }: types.Node): void;
    findIgnoreReason(line: number, mutatorName: string): string | undefined;
    private warnAboutUnusedDirective;
}
//# sourceMappingURL=directive-bookkeeper.d.ts.map