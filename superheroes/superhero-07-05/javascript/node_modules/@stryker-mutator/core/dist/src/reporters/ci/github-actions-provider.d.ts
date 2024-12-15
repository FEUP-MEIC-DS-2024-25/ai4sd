import { CIProvider } from './provider.js';
/**
 * https://help.github.com/en/actions/automating-your-workflow-with-github-actions/using-environment-variables#default-environment-variables
 */
export declare class GithubActionsCIProvider implements CIProvider {
    determineProject(): string;
    determineVersion(): string;
}
//# sourceMappingURL=github-actions-provider.d.ts.map