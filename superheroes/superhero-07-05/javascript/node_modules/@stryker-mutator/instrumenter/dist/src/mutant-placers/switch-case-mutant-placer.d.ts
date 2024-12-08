import { type types } from '@babel/core';
import { MutantPlacer } from './mutant-placer.js';
/**
 * Places the mutants with consequent of a SwitchCase node. Uses an if-statement to do so.
 * @example
 *  case 'foo':
 *    if (stryMutAct_9fa48(0)) {} else {
 *      stryCov_9fa48(0);
 *      console.log('bar');
 *      break;
 *   }
 */
export declare const switchCaseMutantPlacer: MutantPlacer<types.SwitchCase>;
//# sourceMappingURL=switch-case-mutant-placer.d.ts.map