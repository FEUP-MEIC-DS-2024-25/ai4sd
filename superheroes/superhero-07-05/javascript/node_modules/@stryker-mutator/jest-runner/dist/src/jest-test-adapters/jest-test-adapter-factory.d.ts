import { Logger } from '@stryker-mutator/api/logging';
import { StrykerOptions } from '@stryker-mutator/api/core';
import { Injector } from '@stryker-mutator/api/plugin';
import { JestPluginContext } from '../plugin-di.js';
import { JestWrapper } from '../utils/jest-wrapper.js';
import { JestLessThan25TestAdapter } from './jest-less-than-25-adapter.js';
import { JestGreaterThan25TestAdapter } from './jest-greater-than-25-adapter.js';
export declare function jestTestAdapterFactory(log: Logger, jestWrapper: JestWrapper, options: StrykerOptions, injector: Injector<JestPluginContext>): JestGreaterThan25TestAdapter | JestLessThan25TestAdapter;
export declare namespace jestTestAdapterFactory {
    var inject: ["logger", "jestWrapper", "options", "$injector"];
}
//# sourceMappingURL=jest-test-adapter-factory.d.ts.map