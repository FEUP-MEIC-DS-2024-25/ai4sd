import { Injector } from '@stryker-mutator/api/plugin';
import { StrykerOptions } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { JestPluginContext } from '../plugin-di.js';
import { CustomJestConfigLoader } from './custom-jest-config-loader.js';
import { ReactScriptsJestConfigLoader } from './react-scripts-jest-config-loader.js';
export declare function configLoaderFactory(options: StrykerOptions, injector: Injector<JestPluginContext>, log: Logger): CustomJestConfigLoader | ReactScriptsJestConfigLoader;
export declare namespace configLoaderFactory {
    var inject: ["options", "$injector", "logger"];
}
//# sourceMappingURL=index.d.ts.map