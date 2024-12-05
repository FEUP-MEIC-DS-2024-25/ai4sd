import { KnownKeys } from '@stryker-mutator/util';
import { WarningOptions } from '@stryker-mutator/api/core';
export declare const objectUtils: {
    /**
     * Calls a defined callback function on each element of a map, and returns an array that contains the results.
     *
     * @param subject The map to act on
     * @param callbackFn The callback fn
     * @returns
     */
    map<K, V, R>(subject: Map<K, V>, callbackFn: (value: V, key: K) => R): R[];
    /**
     * A wrapper around `process.env` (for testability)
     */
    getEnvironmentVariable(nameEnvironmentVariable: string): string | undefined;
    undefinedEmptyString(str: string | undefined): string | undefined;
    getEnvironmentVariableOrThrow(name: string): string;
    isWarningEnabled(warningType: KnownKeys<WarningOptions>, warningOptions: WarningOptions | boolean): boolean;
    /**
     * A wrapper around `process.exitCode = n` (for testability)
     */
    setExitCode(n: number): void;
    kill(pid: number | undefined): Promise<void>;
    /**
     * Creates a random integer number.
     * @returns A random integer.
     */
    random(): number;
};
//# sourceMappingURL=object-utils.d.ts.map