export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Record<string, any> ? DeepPartial<T[P]> : T[P];
};
/**
 *
 * @param defaults
 * @param overrides
 */
export declare function deepMerge<T>(defaults: T, overrides: DeepPartial<T>): void;
//# sourceMappingURL=deep-merge.d.ts.map