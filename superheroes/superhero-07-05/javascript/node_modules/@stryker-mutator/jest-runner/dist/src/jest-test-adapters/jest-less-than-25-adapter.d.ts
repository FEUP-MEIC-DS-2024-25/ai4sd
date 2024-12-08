import { JestRunResult } from '../jest-run-result.js';
import { JestWrapper } from '../utils/jest-wrapper.js';
import { RunSettings, JestTestAdapter } from './jest-test-adapter.js';
/**
 * The adapter used for 22 < Jest < 25.
 * It has a lot of `any` typings here, since the installed typings are not in sync.
 */
export declare class JestLessThan25TestAdapter implements JestTestAdapter {
    private readonly jestWrapper;
    static readonly inject: readonly ["jestWrapper"];
    constructor(jestWrapper: JestWrapper);
    run({ jestConfig, fileNamesUnderTest, testNamePattern, testLocationInResults }: RunSettings): Promise<JestRunResult>;
}
//# sourceMappingURL=jest-less-than-25-adapter.d.ts.map