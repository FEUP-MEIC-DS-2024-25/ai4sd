import generator from '@babel/generator';
const generate = generator.default;
export const print = (file) => {
    return generate(file.root, { sourceMaps: false }).code;
};
//# sourceMappingURL=js-printer.js.map