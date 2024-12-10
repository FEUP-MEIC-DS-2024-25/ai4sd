import { Logger } from '@stryker-mutator/api/logging';
import { Plugin, PluginKind } from '@stryker-mutator/api/plugin';
/**
 * Represents a collection of loaded plugins and metadata
 */
export interface LoadedPlugins {
    /**
     * The JSON schema contributions loaded
     */
    schemaContributions: Array<Record<string, unknown>>;
    /**
     * The actual Stryker plugins loaded, sorted by type
     */
    pluginsByKind: Map<PluginKind, Array<Plugin<PluginKind>>>;
    /**
     * The import specifiers or full URL paths to the actual plugins
     */
    pluginModulePaths: string[];
}
/**
 * Can resolve modules and pull them into memory
 */
export declare class PluginLoader {
    private readonly log;
    static inject: ["logger"];
    constructor(log: Logger);
    /**
     * Loads plugins based on configured plugin descriptors.
     * A plugin descriptor can be:
     *  * A full url: "file:///home/nicojs/github/my-plugin.js"
     *  * An absolute file path: "/home/nicojs/github/my-plugin.js"
     *  * A relative path: "./my-plugin.js"
     *  * A bare import expression: "@stryker-mutator/karma-runner"
     *  * A simple glob expression (only wild cards are supported): "@stryker-mutator/*"
     */
    load(pluginDescriptors: readonly string[]): Promise<LoadedPlugins>;
    private resolvePluginModules;
    private globPluginModules;
    private loadPlugin;
}
//# sourceMappingURL=plugin-loader.d.ts.map