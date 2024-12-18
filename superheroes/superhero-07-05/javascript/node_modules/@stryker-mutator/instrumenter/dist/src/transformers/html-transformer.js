export const transformHtml = ({ root }, mutantCollector, context) => {
    root.scripts.forEach((ast) => {
        context.transform(ast, mutantCollector, context);
    });
};
//# sourceMappingURL=html-transformer.js.map