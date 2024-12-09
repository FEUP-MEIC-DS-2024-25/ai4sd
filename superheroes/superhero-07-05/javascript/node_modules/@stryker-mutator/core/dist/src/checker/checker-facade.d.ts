import { CheckResult } from '@stryker-mutator/api/check';
import { MutantRunPlan } from '@stryker-mutator/api/core';
import { ResourceDecorator } from '../concurrent/index.js';
import { CheckerResource } from './checker-resource.js';
export declare class CheckerFacade extends ResourceDecorator<CheckerResource> {
    check(checkerName: string, mutantRunPlans: MutantRunPlan[]): Promise<Array<[MutantRunPlan, CheckResult]>>;
    group(checkerName: string, mutantRunPlans: MutantRunPlan[]): Promise<MutantRunPlan[][]>;
}
//# sourceMappingURL=checker-facade.d.ts.map