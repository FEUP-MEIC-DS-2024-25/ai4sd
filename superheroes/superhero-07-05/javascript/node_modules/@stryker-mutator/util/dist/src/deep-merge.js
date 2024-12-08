/**
 *
 * @param defaults
 * @param overrides
 */
export function deepMerge(defaults, overrides) {
    Object.keys(overrides).forEach((key) => {
        const defaultValue = defaults[key];
        const overrideValue = overrides[key];
        if (overrideValue !== undefined) {
            if (defaultValue === undefined || typeof defaultValue !== 'object' || typeof overrideValue !== 'object' || Array.isArray(defaultValue)) {
                defaults[key] = overrideValue;
            }
            else {
                deepMerge(defaultValue, overrideValue);
            }
        }
    });
}
//# sourceMappingURL=deep-merge.js.map