import { PartialStrykerOptions, StrykerOptions } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { I } from '@stryker-mutator/util';
import { ConfigError } from '../errors.js';
import { OptionsValidator } from './options-validator.js';
export declare const CONFIG_SYNTAX_HELP: string;
export declare class ConfigReader {
    private readonly log;
    private readonly validator;
    static inject: ["logger", "optionsValidator"];
    constructor(log: Logger, validator: I<OptionsValidator>);
    readConfig(cliOptions: PartialStrykerOptions): Promise<StrykerOptions>;
    private loadOptionsFromConfigFile;
    private findConfigFile;
    private readJsonConfig;
    private importJSConfig;
    private importJSConfigModule;
    private hasDefaultExport;
}
export declare class ConfigReaderError extends ConfigError {
    constructor(message: string, configFileName: string, cause?: unknown);
}
//# sourceMappingURL=config-reader.d.ts.map