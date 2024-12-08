import { CIProvider } from './provider.js';
/**
 * https://circleci.com/docs/2.0/env-vars/#built-in-environment-variables
 */
export declare class CircleProvider implements CIProvider {
    determineProject(): string;
    determineVersion(): string | undefined;
    private determineRepository;
    private determineProvider;
}
//# sourceMappingURL=circle-provider.d.ts.map