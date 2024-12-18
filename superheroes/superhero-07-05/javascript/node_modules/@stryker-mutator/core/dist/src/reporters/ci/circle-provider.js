import { objectUtils } from '../../utils/object-utils.js';
/**
 * https://circleci.com/docs/2.0/env-vars/#built-in-environment-variables
 */
export class CircleProvider {
    determineProject() {
        return `${this.determineProvider()}/${this.determineRepository()}`;
    }
    determineVersion() {
        return (objectUtils.undefinedEmptyString(objectUtils.getEnvironmentVariable('CIRCLE_PR_NUMBER')) ??
            objectUtils.undefinedEmptyString(objectUtils.getEnvironmentVariable('CIRCLE_BRANCH')) ??
            objectUtils.undefinedEmptyString(objectUtils.getEnvironmentVariable('CIRCLE_TAG')));
    }
    determineRepository() {
        const username = objectUtils.getEnvironmentVariableOrThrow('CIRCLE_PROJECT_USERNAME');
        const repoName = objectUtils.getEnvironmentVariableOrThrow('CIRCLE_PROJECT_REPONAME');
        return `${username}/${repoName}`;
    }
    determineProvider() {
        // Repo url can be in 2 forms:
        // - 'git@github.com:company/repo.git'
        // - 'https://github.com/company/repo'
        // See https://discuss.circleci.com/t/circle-repository-url-changed-format-in-v2/15273
        const repoUrl = objectUtils.getEnvironmentVariableOrThrow('CIRCLE_REPOSITORY_URL');
        if (repoUrl.startsWith('git@')) {
            return repoUrl.substr(4).split(':')[0];
        }
        else {
            return repoUrl.split('//')[1].split('/')[0];
        }
    }
}
//# sourceMappingURL=circle-provider.js.map