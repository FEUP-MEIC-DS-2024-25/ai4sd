import { commonTokens, tokens } from '@stryker-mutator/api/plugin';
import { coreTokens } from '../di/index.js';
import { CheckerChildProcessProxy } from './checker-child-process-proxy.js';
import { CheckerFacade } from './checker-facade.js';
import { CheckerRetryDecorator } from './checker-retry-decorator.js';
createCheckerFactory.inject = tokens(commonTokens.options, commonTokens.fileDescriptions, coreTokens.loggingContext, coreTokens.pluginModulePaths, commonTokens.getLogger, coreTokens.workerIdGenerator);
export function createCheckerFactory(options, fileDescriptions, loggingContext, pluginModulePaths, getLogger, idGenerator) {
    return () => new CheckerFacade(() => new CheckerRetryDecorator(() => new CheckerChildProcessProxy(options, fileDescriptions, pluginModulePaths, loggingContext, idGenerator), getLogger(CheckerRetryDecorator.name)));
}
//# sourceMappingURL=checker-factory.js.map