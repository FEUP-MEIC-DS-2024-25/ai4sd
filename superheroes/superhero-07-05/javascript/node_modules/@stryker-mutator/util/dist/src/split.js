export function split(values, predicate) {
    const left = [];
    const right = [];
    let index = 0;
    for (const value of values) {
        if (predicate(value, index++)) {
            left.push(value);
        }
        else {
            right.push(value);
        }
    }
    return [left, right];
}
//# sourceMappingURL=split.js.map