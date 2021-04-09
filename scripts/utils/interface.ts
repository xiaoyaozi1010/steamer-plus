export enum PLATFORM {
    PC = 'pc',
    MOBILE = 'mobile',
    PAD = 'pad',
    ALL = 'all',
    ANALYZER = 'analyzer',
}

export interface IBuildProps {
    start: () => void,
}

export interface IBuildOptions {
    isDev: boolean,
    isProduction: boolean,
    platform: PLATFORM,
    outputAlias?: any,  // 输出html文件的alias，pc: 'p', mobile: 'm',
    argv: any, // 命令行输入参数
}


