import { CircleProvider } from './circle-provider.js';
import { TravisProvider } from './travis-provider.js';
import { GithubActionsCIProvider } from './github-actions-provider.js';
/**
 * Represents an object that can provide information about a CI/CD provider.
 */
export interface CIProvider {
    /**
     * Determine the repository slug, including the git provider. I.E: github.com/stryker-mutator/stryker or bitbucket.org/org/name.
     */
    determineProject(): string | undefined;
    /**
     * Determine the current version. I.e. branch name, git sha, or tag name
     */
    determineVersion(): string | undefined;
}
/**
 * Return an appropriate instance of CiProvider.
 * @returns An instance of CiProvider, or `null` if it appears Stryker is not running in a CI/CD environment.
 */
export declare function determineCIProvider(): CircleProvider | GithubActionsCIProvider | TravisProvider | null;
//# sourceMappingURL=provider.d.ts.map