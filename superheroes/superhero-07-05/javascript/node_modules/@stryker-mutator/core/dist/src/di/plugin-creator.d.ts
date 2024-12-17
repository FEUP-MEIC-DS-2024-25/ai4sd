import { Plugins, PluginInterfaces, PluginContext, Injector, Plugin, PluginKind } from '@stryker-mutator/api/plugin';
export declare class PluginCreator {
    private readonly pluginsByKind;
    private readonly injector;
    static readonly inject: ["pluginsByKind", "$injector"];
    constructor(pluginsByKind: Map<PluginKind, Array<Plugin<PluginKind>>>, injector: Injector<PluginContext>);
    create<TPlugin extends keyof Plugins>(kind: TPlugin, name: string): PluginInterfaces[TPlugin];
    private findPlugin;
}
//# sourceMappingURL=plugin-creator.d.ts.map