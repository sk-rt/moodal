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
    log(level: LogLevel, ...obj: any[]) {
        /* eslint no-console: 0 */
        if (this.showLogLevel === LogLevel.off) {
            return;
        }
        if (this.showLogLevel >= level) {
            switch (level) {
                case LogLevel.error:
                    console.error(...obj);
                    break;
                case LogLevel.warning:
                    console.warn(...obj);
                    break;
                case LogLevel.info:
                    console.info(...obj);
                    break;
                case LogLevel.debug:
                    console.log(...obj);
                    break;
                default:
                    break;
            }
        }
    }
}
