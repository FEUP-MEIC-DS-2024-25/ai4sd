import { CIProvider } from './provider.js';
/**
 * See https://docs.travis-ci.com/user/environment-variables/#default-environment-variables
 */
export declare class TravisProvider implements CIProvider {
    determineProject(): string | undefined;
    determineVersion(): string | undefined;
}
//# sourceMappingURL=travis-provider.d.ts.map