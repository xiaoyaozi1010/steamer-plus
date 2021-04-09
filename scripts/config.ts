import dayjs from 'dayjs';
import childProcess from 'child_process';
export interface IConfig {
    host?: string, // 开发服务器host地址，默认 localhost
    entryDir: string, // 入口文件目录
    dist: string, // 生产物目录
    devDir: string, // 开发目录
    publicPath: string, // 生产环境publicPath
    context: string, // webpack 打包上下文
    define: { [envKey: string]: string }, // 注入process.env的环境变量
    statics: string | string[], // 静态文件目录，会被拷贝至发布目录
    root: string, // 根目录，默认process.cwd()
    devServer: any, // 开发服务器配置，可提供proxy配置
}
const RAVEN_VERSION = `${dayjs(new Date()).format('YYYYMMDD-HHmm')}`;
const COMMIT_ID = childProcess.execSync('git rev-parse --short HEAD', { encoding: 'utf-8' });
const BRANCH_NAME = childProcess.execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' });

const config: IConfig = {
    root: './src',
    // webpack入口目录，相对于根目录或绝对目录，会扫描该根目录下所有js、ts文件
    entryDir: './src/entries',
    // 输出目录
    dist: './dist',
    // dev目录
    devDir: './dev',
    // 生产环境路径
    publicPath: '//docs.idqqimg.com/tim/docs/tdoccoops/',
    // 工作目录
    context: process.cwd(),
    // 注入变量
    define: {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        RELEASE_VERSION: JSON.stringify(process.env.release || '1.0.0.0'),
        REPORT_LIB_VERSION: JSON.stringify(require('@tencent/tencent-doc-report/package.json').version),
        RAVEN_VERSION: JSON.stringify(RAVEN_VERSION),
        COMMIT_ID: JSON.stringify(COMMIT_ID),
        BRANCH_NAME: JSON.stringify(BRANCH_NAME),
    },
    // 静态资源目录，会被完整的拷贝到dist内，支持数组
    statics: ['./statics'],
    devServer: {
        port: 9000,
    },
};

export default config;
