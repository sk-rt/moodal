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
    showLogLebel: LogLevel;
    constructor(showLogLebel: LogLevel) {
        this.showLogLebel = showLogLebel;
    }
    log(message: Error | string, level: LogLevel) {
        /* eslint no-console: 0 */
        if (this.showLogLebel === LogLevel.off) {
            return;
        }
        if (this.showLogLebel >= level) {
            switch (level) {
                case LogLevel.error:
                    console.error(message);
                    break;
                case LogLevel.warning:
                    console.warn(message);
                    break;
                case LogLevel.info:
                    console.info(message);
                    break;
                case LogLevel.debug:
                    console.log(message);
                    break;
                default:
                    break;
            }
        }
    }
}
