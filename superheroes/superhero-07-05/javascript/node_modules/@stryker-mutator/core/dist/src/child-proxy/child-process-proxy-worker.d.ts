import { createInjector } from 'typed-inject';
import { PluginContext } from '@stryker-mutator/api/plugin';
import { coreTokens, PluginCreator } from '../di/index.js';
export interface ChildProcessContext extends PluginContext {
    [coreTokens.pluginCreator]: PluginCreator;
}
export declare class ChildProcessProxyWorker {
    private readonly injectorFactory;
    private log?;
    realSubject: any;
    constructor(injectorFactory: typeof createInjector);
    private send;
    private handleMessage;
    private handleInit;
    private handleCall;
    private doCall;
    /**
     * Remove any addition message listeners that might me eavesdropping.
     * the @ngtools/webpack plugin listens to messages and throws an error whenever it could not handle a message
     * @see https://github.com/angular/angular-cli/blob/f776d3cf7982b64734c57fe4407434e9f4ec09f7/packages/%40ngtools/webpack/src/type_checker.ts#L79
     * @param exceptListener The listener that should remain
     */
    private removeAnyAdditionalMessageListeners;
    /**
     * During mutation testing, it's to be expected that promise rejections are not handled synchronously anymore (or not at all)
     * Let's handle those events so future versions of node don't crash
     * See issue 350: https://github.com/stryker-mutator/stryker-js/issues/350
     */
    private handlePromiseRejections;
}
//# sourceMappingURL=child-process-proxy-worker.d.ts.map