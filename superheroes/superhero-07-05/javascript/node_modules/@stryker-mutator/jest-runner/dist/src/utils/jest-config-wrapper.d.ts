import type jestConfig from 'jest-config';
export declare class JestConfigWrapper {
    private readonly jestConfig;
    static readonly inject: readonly ["resolveFromDirectory"];
    constructor(resolveFromDirectory: string);
    readInitialOptions(...args: Parameters<typeof jestConfig.readInitialOptions>): ReturnType<typeof jestConfig.readInitialOptions>;
}
//# sourceMappingURL=jest-config-wrapper.d.ts.map