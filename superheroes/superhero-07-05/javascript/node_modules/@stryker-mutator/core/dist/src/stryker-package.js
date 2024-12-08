import { fileURLToPath, URL } from 'url';
import fs from 'fs';
import { deepFreeze } from '@stryker-mutator/util';
const pkg = deepFreeze(JSON.parse(fs.readFileSync(fileURLToPath(new URL('../../package.json', import.meta.url)), 'utf-8')));
export const strykerVersion = pkg.version;
export const strykerEngines = pkg.engines;
//# sourceMappingURL=stryker-package.js.map