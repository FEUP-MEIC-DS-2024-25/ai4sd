const guideUrl = 'https://stryker-mutator.io/docs/stryker-js/guides/vuejs';
/**
 * More information can be found in the Stryker handbook:
 * https://stryker-mutator.io/docs/stryker-js/guides/vuejs
 */
export class VueJsInitializer {
    name = 'vue';
    vitestConf = {
        testRunner: 'vitest',
        reporters: ['progress', 'clear-text', 'html'],
    };
    createConfig() {
        return Promise.resolve({
            config: this.vitestConf,
            dependencies: ['@stryker-mutator/vitest-runner'],
            guideUrl,
        });
    }
}
//# sourceMappingURL=vue-js-initializer.js.map