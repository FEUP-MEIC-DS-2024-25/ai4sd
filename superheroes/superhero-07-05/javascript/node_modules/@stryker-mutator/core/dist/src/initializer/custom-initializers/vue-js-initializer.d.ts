import { CustomInitializer, CustomInitializerConfiguration } from './custom-initializer.js';
/**
 * More information can be found in the Stryker handbook:
 * https://stryker-mutator.io/docs/stryker-js/guides/vuejs
 */
export declare class VueJsInitializer implements CustomInitializer {
    readonly name = "vue";
    private readonly vitestConf;
    createConfig(): Promise<CustomInitializerConfiguration>;
}
//# sourceMappingURL=vue-js-initializer.d.ts.map