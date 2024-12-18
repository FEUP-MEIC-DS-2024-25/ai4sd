import { AstByFormat, AstFormat } from '../syntax/index.js';
import { ParserOptions } from './parser-options.js';
export declare function createParser(parserOptions: ParserOptions): <T extends AstFormat = AstFormat>(code: string, fileName: string, formatOverride?: T) => Promise<AstByFormat[T]>;
export declare function getFormat(fileName: string, override?: AstFormat): AstFormat | undefined;
//# sourceMappingURL=create-parser.d.ts.map