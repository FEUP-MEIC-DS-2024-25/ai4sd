import { readFileSync } from 'fs';
import { URL } from 'url';
const strykerCoreSchema = JSON.parse(readFileSync(new URL('../../schema/stryker-core.json', import.meta.url), 'utf-8'));
export { strykerCoreSchema };
//# sourceMappingURL=stryker-options-schema.js.map