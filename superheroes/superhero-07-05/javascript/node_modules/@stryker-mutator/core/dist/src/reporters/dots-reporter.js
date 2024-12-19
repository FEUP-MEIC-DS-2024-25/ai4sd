import os from 'os';
import chalk from 'chalk';
export class DotsReporter {
    onMutantTested(result) {
        let toLog;
        switch (result.status) {
            case 'Killed':
                toLog = '.';
                break;
            case 'Timeout':
                toLog = chalk.yellow('T');
                break;
            case 'Survived':
                toLog = chalk.bold.red('S');
                break;
            case 'RuntimeError':
                toLog = chalk.yellow('E');
                break;
            default:
                toLog = '';
                break;
        }
        process.stdout.write(toLog);
    }
    onMutationTestReportReady() {
        process.stdout.write(os.EOL);
    }
}
//# sourceMappingURL=dots-reporter.js.map