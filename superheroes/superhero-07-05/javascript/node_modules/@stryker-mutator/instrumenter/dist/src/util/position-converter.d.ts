import { Position } from '@stryker-mutator/api/core';
/**
 * A class that can convert a string offset back to line / column.
 * Grabbed from TypeScript code base
 * @see https://github.com/microsoft/TypeScript/blob/aa9b6953441b53f8b14072c047f0519b611150c4/src/compiler/scanner.ts#L503
 */
export declare class PositionConverter {
    private readonly text;
    private _lineStarts?;
    private get lineStarts();
    constructor(text: string);
    positionFromOffset(offset: number): Position;
    private computeLineOfPosition;
    private computeLineStarts;
}
//# sourceMappingURL=position-converter.d.ts.map