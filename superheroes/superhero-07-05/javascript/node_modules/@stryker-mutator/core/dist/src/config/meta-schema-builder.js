import { commonTokens, tokens } from '@stryker-mutator/api/plugin';
import { coreTokens } from '../di/index.js';
export class MetaSchemaBuilder {
    schema;
    log;
    static inject = tokens(coreTokens.validationSchema, commonTokens.logger);
    constructor(schema, log) {
        this.schema = schema;
        this.log = log;
    }
    buildMetaSchema(pluginSchemaContributions) {
        this.log.debug('Contributing %s schemas from plugins to options validation.', pluginSchemaContributions.length);
        return mergedSchema(this.schema, pluginSchemaContributions);
    }
}
function mergedSchema(mainSchema, additionalSchemas) {
    const schema = {
        ...mainSchema,
        properties: {
            ...mainSchema.properties,
        },
        definitions: {
            ...mainSchema.definitions,
        },
    };
    Object.assign(schema.properties, ...additionalSchemas.map((s) => s.properties));
    Object.assign(schema.definitions, ...additionalSchemas.map((s) => s.definitions));
    return schema;
}
//# sourceMappingURL=meta-schema-builder.js.map