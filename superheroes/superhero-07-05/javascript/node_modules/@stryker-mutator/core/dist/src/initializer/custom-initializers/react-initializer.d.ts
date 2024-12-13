import { CustomInitializer, CustomInitializerConfiguration } from './custom-initializer.js';
/**
 * More information can be found in the Stryker handbook:
 * https://stryker-mutator.io/docs/stryker-js/guides/react
 */
export declare class ReactInitializer implements CustomInitializer {
    readonly name = "create-react-app";
    private readonly dependencies;
    private readonly config;
    createConfig(): Promise<CustomInitializerConfiguration>;
}
//# sourceMappingURL=react-initializer.d.ts.map