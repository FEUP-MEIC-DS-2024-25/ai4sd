import { Disposable } from '@stryker-mutator/api/plugin';
export type ExitHandler = () => void;
export declare class UnexpectedExitHandler implements Disposable {
    private readonly process;
    private readonly unexpectedExitHandlers;
    static readonly inject: readonly ["process"];
    constructor(process: Pick<NodeJS.Process, 'exit' | 'off' | 'on'>);
    private readonly processSignal;
    private readonly handleExit;
    registerHandler(handler: ExitHandler): void;
    dispose(): void;
}
//# sourceMappingURL=unexpected-exit-handler.d.ts.map