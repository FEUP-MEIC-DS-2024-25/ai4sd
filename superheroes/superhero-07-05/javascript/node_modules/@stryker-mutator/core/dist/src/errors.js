import { StrykerError } from '@stryker-mutator/util';
import { InjectionError } from 'typed-inject';
export class ConfigError extends StrykerError {
}
export function retrieveCause(error) {
    if (error instanceof InjectionError) {
        return error.cause;
    }
    else {
        return error;
    }
}
//# sourceMappingURL=errors.js.map