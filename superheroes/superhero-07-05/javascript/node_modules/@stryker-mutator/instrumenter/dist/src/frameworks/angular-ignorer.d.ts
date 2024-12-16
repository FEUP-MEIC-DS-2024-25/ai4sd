import { Ignorer, NodePath } from '@stryker-mutator/api/ignore';
/**
 * An ignorer that ignores mutations on Angular constructs that wouldn't survive compilation.
 * This ignorer will ignore mutations on the following constructs:
 * - Angular signal based input, model and output functions configuration object.
 */
export declare class AngularIgnorer implements Ignorer {
    shouldIgnore(path: NodePath): string | undefined;
    /**
     * Determines if the given path is a configuration object for an Angular input, model or output function.
     * This solves the "Argument needs to be statically analyzable." error
     */
    private isInputModelOrOutputConfigurationObject;
}
//# sourceMappingURL=angular-ignorer.d.ts.map