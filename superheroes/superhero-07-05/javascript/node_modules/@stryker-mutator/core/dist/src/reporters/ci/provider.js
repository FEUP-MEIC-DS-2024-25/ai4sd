import { objectUtils } from '../../utils/object-utils.js';
import { CircleProvider } from './circle-provider.js';
import { TravisProvider } from './travis-provider.js';
import { GithubActionsCIProvider } from './github-actions-provider.js';
/**
 * Return an appropriate instance of CiProvider.
 * @returns An instance of CiProvider, or `null` if it appears Stryker is not running in a CI/CD environment.
 */
export function determineCIProvider() {
    // By far the coolest env. variable from all those listed at
    // https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables
    if (objectUtils.getEnvironmentVariable('HAS_JOSH_K_SEAL_OF_APPROVAL')) {
        return new TravisProvider();
    }
    else if (objectUtils.getEnvironmentVariable('CIRCLECI')) {
        return new CircleProvider();
    }
    else if (objectUtils.getEnvironmentVariable('GITHUB_ACTION')) {
        return new GithubActionsCIProvider();
    }
    // TODO: Add vsts and gitlab CI
    return null;
}
//# sourceMappingURL=provider.js.map