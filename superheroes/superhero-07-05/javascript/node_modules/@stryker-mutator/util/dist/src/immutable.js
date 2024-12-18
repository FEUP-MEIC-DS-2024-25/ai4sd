export function deepFreeze(target) {
    switch (typeof target) {
        case 'object':
            if (Array.isArray(target)) {
                return Object.freeze(target.map(deepFreeze));
            }
            if (target instanceof Map) {
                return Object.freeze(new Map([...target.entries()].map(([k, v]) => [deepFreeze(k), deepFreeze(v)])));
            }
            if (target instanceof RegExp) {
                return Object.freeze(target);
            }
            if (target === null) {
                return null;
            }
            if (target instanceof Set) {
                return Object.freeze(new Set([...target.values()].map(deepFreeze)));
            }
            return Object.freeze({
                ...Object.entries(target).reduce((result, [prop, val]) => {
                    result[prop] = deepFreeze(val);
                    return result;
                }, {}),
            });
        default:
            return target;
    }
}
//# sourceMappingURL=immutable.js.map