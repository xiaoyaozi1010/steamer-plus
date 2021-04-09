import chalk from 'chalk';

type ILogType = 'warn' | 'error' | 'success' | 'info';

const CHALK_COLOR_MAP = {
    warn: 'yellow',
    error: 'red',
    success: 'green',
    info: 'blue',
};

type IChalkColor = 'yellow' | 'red' | 'green';

class SysLog {
    private fnType(type: ILogType): Function {
        return chalk[CHALK_COLOR_MAP[type] as IChalkColor]
    }
    // TODO: 柯里化
    private wrapper(type?: ILogType): Function {
        // TODO: 适配更多内部日志样式
        if (!type) return console.log;
        const beautyFn = this.fnType(type);
        return (info: any) => {
            const infoMsg = typeof info === 'string' ? `${chalk.gray('[steamer-plus]:')} ${beautyFn(info)}` : beautyFn(info);
            return console.log(infoMsg);
        };
    }
    log(info: any) {
        this.wrapper('info')(info);
    }
    error(info: any) {
        this.wrapper('error')(info);
    }
    warn(info: any) {
        this.wrapper('warn')(info);
    }
    success(info: any) {
        this.wrapper('success')(info);
    }
}
const syslog = new SysLog();

export default syslog;
