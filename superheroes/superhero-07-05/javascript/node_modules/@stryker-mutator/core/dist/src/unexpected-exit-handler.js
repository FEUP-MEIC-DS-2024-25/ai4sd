import { coreTokens } from './di/index.js';
const signals = Object.freeze(['SIGABRT', 'SIGINT', 'SIGHUP', 'SIGTERM']);
export class UnexpectedExitHandler {
    process;
    unexpectedExitHandlers = [];
    static inject = [coreTokens.process];
    constructor(process) {
        this.process = process;
        process.on('exit', this.handleExit);
        signals.forEach((signal) => process.on(signal, this.processSignal));
    }
    processSignal = (_signal, signalNumber) => {
        // Just call 'exit' with correct exitCode.
        // See https://nodejs.org/api/process.html#process_signal_events, we should exit with 128 + signal number
        this.process.exit(128 + signalNumber);
    };
    handleExit = () => {
        this.unexpectedExitHandlers.forEach((handler) => handler());
    };
    registerHandler(handler) {
        this.unexpectedExitHandlers.push(handler);
    }
    dispose() {
        this.process.off('exit', this.handleExit);
        signals.forEach((signal) => this.process.off(signal, this.processSignal));
    }
}
//# sourceMappingURL=unexpected-exit-handler.js.map