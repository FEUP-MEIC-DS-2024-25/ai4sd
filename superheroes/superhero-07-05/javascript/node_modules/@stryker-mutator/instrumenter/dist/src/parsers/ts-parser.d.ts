import { TSAst, TsxAst } from '../syntax/index.js';
/**
 * See https://babeljs.io/docs/en/babel-preset-typescript
 * @param text The text to parse
 * @param fileName The name of the file
 */
export declare function parseTS(text: string, fileName: string): Promise<TSAst>;
export declare function parseTsx(text: string, fileName: string): Promise<TsxAst>;
//# sourceMappingURL=ts-parser.d.ts.map