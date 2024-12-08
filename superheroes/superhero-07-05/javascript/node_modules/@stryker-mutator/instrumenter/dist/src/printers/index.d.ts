import { Ast } from '../syntax/index.js';
export type Printer<T extends Ast> = (file: T, context: PrinterContext) => string;
export interface PrinterContext {
    print: Printer<Ast>;
}
export declare function print(file: Ast): string;
//# sourceMappingURL=index.d.ts.map