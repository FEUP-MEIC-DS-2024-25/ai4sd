import { StrykerOptions } from '@stryker-mutator/api/core';
import { Immutable } from '@stryker-mutator/util';
import { Logger } from '@stryker-mutator/api/logging';
import type { JSONSchema7 } from 'json-schema';
export declare class OptionsValidator {
    private readonly schema;
    private readonly log;
    private readonly validateFn;
    static readonly inject: ["validationSchema", "logger"];
    constructor(schema: JSONSchema7, log: Logger);
    /**
     * Validates the provided options, throwing an error if something is wrong.
     * Optionally also warns about excess or unserializable options.
     * @param options The stryker options to validate
     * @param mark Wether or not to log warnings on unknown properties or unserializable properties
     */
    validate(options: Record<string, unknown>, mark?: boolean): asserts options is StrykerOptions;
    private removeDeprecatedOptions;
    private customValidation;
    private schemaValidate;
    private throwErrorIfNeeded;
    private markOptions;
    private markExcessOptions;
    private markUnserializableOptions;
}
export declare function createDefaultOptions(): StrykerOptions;
export declare const defaultOptions: Immutable<StrykerOptions>;
//# sourceMappingURL=options-validator.d.ts.map