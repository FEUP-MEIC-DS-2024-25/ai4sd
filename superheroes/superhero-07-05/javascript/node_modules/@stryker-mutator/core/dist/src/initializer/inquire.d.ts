import { select, confirm, input, checkbox, Separator } from '@inquirer/prompts';
/**
 * @description Small wrapper around inquire prompts to make it easier to mock in tests
 */
export declare const inquire: {
    select: typeof select;
    confirm: typeof confirm;
    input: typeof input;
    checkbox: typeof checkbox;
    separator: () => Separator;
};
//# sourceMappingURL=inquire.d.ts.map