import { execaCommandSync } from 'execa';
import { RestClient } from 'typed-rest-client';
import { Logger } from '@stryker-mutator/api/logging';
declare function getRegistry(logger: Logger, execaSync: typeof execaCommandSync): string;
declare namespace getRegistry {
    var inject: readonly ["logger", "execaSync"];
}
declare function createNpmRegistryClient(npmRegistry: string): RestClient;
declare namespace createNpmRegistryClient {
    var inject: readonly ["npmRegistry"];
}
export { createNpmRegistryClient, getRegistry };
//# sourceMappingURL=npm-registry.d.ts.map