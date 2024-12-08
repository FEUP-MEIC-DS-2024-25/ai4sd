import generator from '@babel/generator';
const generate = generator.default;
export const print = (file) => {
    return generate(file.root, {
        decoratorsBeforeExport: true,
        sourceMaps: false,
    }).code;
};
//# sourceMappingURL=ts-printer.js.map