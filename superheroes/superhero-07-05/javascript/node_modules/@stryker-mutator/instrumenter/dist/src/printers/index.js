import { AstFormat } from '../syntax/index.js';
import { print as htmlPrint } from './html-printer.js';
import { print as jsPrint } from './js-printer.js';
import { print as tsPrint } from './ts-printer.js';
import { print as sveltePrint } from './svelte-printer.js';
export function print(file) {
    const context = {
        print,
    };
    switch (file.format) {
        case AstFormat.JS:
            return jsPrint(file, context);
        case AstFormat.TS:
            return tsPrint(file, context);
        case AstFormat.Tsx:
            return tsPrint(file, context);
        case AstFormat.Html:
            return htmlPrint(file, context);
        case AstFormat.Svelte:
            return sveltePrint(file, context);
    }
}
//# sourceMappingURL=index.js.map