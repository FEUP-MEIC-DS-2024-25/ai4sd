import { JestRunResult } from '../jest-run-result.js';
import { JestWrapper } from '../utils/jest-wrapper.js';
import { JestTestAdapter, RunSettings } from './jest-test-adapter.js';
export declare class JestGreaterThan25TestAdapter implements JestTestAdapter {
    private readonly jestWrapper;
    static readonly inject: readonly ["jestWrapper"];
    constructor(jestWrapper: JestWrapper);
    run({ jestConfig, fileNamesUnderTest, testNamePattern, testLocationInResults }: RunSettings): Promise<JestRunResult>;
}
//# sourceMappingURL=jest-greater-than-25-adapter.d.ts.map