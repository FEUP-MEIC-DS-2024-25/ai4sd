import { DryRunResult, TimeoutDryRunResult } from './dry-run-result.js';
import { MutantRunResult } from './mutant-run-result.js';
export declare function determineHitLimitReached(hitCount: number | undefined, hitLimit: number | undefined): TimeoutDryRunResult | undefined;
export declare function toMutantRunResult(dryRunResult: DryRunResult, reportAllKillers?: boolean): MutantRunResult;
//# sourceMappingURL=run-result-helpers.d.ts.map