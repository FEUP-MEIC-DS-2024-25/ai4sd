import * as childProcess from 'child_process';
import { promisify } from 'util';
export const childProcessAsPromised = {
    exec: promisify(childProcess.exec),
};
//# sourceMappingURL=child-process-as-promised.js.map