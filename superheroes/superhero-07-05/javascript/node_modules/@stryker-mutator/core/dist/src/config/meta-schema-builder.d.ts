import type { JSONSchema7 } from 'json-schema';
import { Logger } from '@stryker-mutator/api/logging';
export declare class MetaSchemaBuilder {
    private readonly schema;
    private readonly log;
    static inject: ["validationSchema", "logger"];
    constructor(schema: JSONSchema7, log: Logger);
    buildMetaSchema(pluginSchemaContributions: Array<Record<string, unknown>>): JSONSchema7;
}
//# sourceMappingURL=meta-schema-builder.d.ts.map