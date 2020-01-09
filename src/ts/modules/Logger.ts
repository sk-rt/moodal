/**
 * Logger
 */
export enum LogLevel {
    off = 0,
    error = 1,
    warning = 2,
    info = 3,
    debug = 4
}
export default class Logger {
    showLogLevel: LogLevel;
    constructor(showLogLevel: LogLevel) {
        this.showLogLevel = showLogLevel;
    }
    log(level: LogLevel, ...logs: any[]) {
        /* eslint no-console: 0 */
        if (this.showLogLevel === LogLevel.off) {
            return;
        }
        if (this.showLogLevel >= level) {
            switch (level) {
                case LogLevel.error:
                    console.error(...logs);
                    break;
                case LogLevel.warning:
                    console.warn(...logs);
                    break;
                case LogLevel.info:
                    console.info(...logs);
                    break;
                case LogLevel.debug:
                    console.log(...logs);
                    break;
                default:
                    break;
            }
        }
    }
}
