import { Mutant } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { ResourceDecorator } from '../concurrent/index.js';
import { CheckerResource } from './checker-resource.js';
export declare class CheckerRetryDecorator extends ResourceDecorator<CheckerResource> implements CheckerResource {
    private readonly log;
    constructor(producer: () => CheckerResource, log: Logger);
    check(checkerName: string, mutants: Mutant[]): ReturnType<CheckerResource['check']>;
    group(checkerName: string, mutants: Mutant[]): ReturnType<CheckerResource['group']>;
    private tryAction;
}
//# sourceMappingURL=checker-retry-decorator.d.ts.map