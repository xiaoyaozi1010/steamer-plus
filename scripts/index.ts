import { argv } from 'yargs';
import webpack, { Configuration } from 'webpack';
import { IBuildProps, PLATFORM, IBuildOptions } from './utils/interface';
import syslog from './utils/sys-log'
import { getWebpackConfig } from './webpack'
import { devServer } from './webpack/config/server';

class Builder implements IBuildProps {
    protected platform: PLATFORM;
    private readonly isDev: boolean;
    private isProduction: boolean;
    private argv: any;
    get options(): IBuildOptions {
        const { isDev, isProduction, platform, argv } = this;
        return {
            isDev,
            isProduction,
            platform,
            argv,
            outputAlias: {
                mobile: 'mobile',
                pc: 'pc',
                pad: 'pad',
            },
        }
    }
    constructor() {
        this.platform = <PLATFORM.PC>argv.platform || PLATFORM.ALL;
        this.isDev = argv.env !== 'production';
        this.isProduction = argv.env === 'production';
        this.argv = argv;
        this.start();
    }
    private build() {
        syslog.log('开始生产环境构建...');
        let config: Configuration[] = [];
        if (this.platform === PLATFORM.ALL) {
            config = [PLATFORM.MOBILE, PLATFORM.PC, PLATFORM.PAD].map(platform => getWebpackConfig({
                ...this.options,
                platform,
            }))
        } else {
            config = [
                getWebpackConfig({
                    ...this.options,
                    platform: this.platform,
                })
            ]
        }
        const compiler = webpack(config);
        compiler.run((err, stats: any) => {
            if (err) {
                console.error(err.stack || err);
                if (err.message) {
                    console.error(err.message);
                }
                return;
            }

            const info = stats.toJson();

            if (stats.hasErrors()) {
                syslog.error('error')
                // TODO：打印子compiler错误
                // TODO: beautify errors
                console.error(
                    info.children[0].errors,
                    info.children[0].children[0].errors,
                );
            }

            if (stats.hasWarnings()) {
                syslog.warn('warning')
                console.warn(info.warnings);
            }
        });
    }
    private dev() {
        syslog.log('正在开启开发环境...')
        let config: Configuration[] = [];
        if (this.platform === PLATFORM.ALL) {
            // TODO: 不存在的入口文件要排除，给出警告
            config = [PLATFORM.MOBILE, PLATFORM.PC].map(platform => {
                return getWebpackConfig({
                    ...this.options,
                    platform,
                })
            })
        } else {
            config = [
                getWebpackConfig({
                    ...this.options,
                })
            ]
        }
        const compiler = webpack(config);
        devServer(compiler, this.options);
    }
    public start() {
        this.initEnv();
        if (this.isDev) {
            this.dev();
        } else {
            this.build();
        }
    }
    private initEnv() {
        const platform = this.platform;
        process.env.PLATFORM = platform;
        process.env.NODE_ENV = <string>argv.env || 'development';
        process.env.BABEL_ENV = <string>argv.env || 'development';
    }
}

new Builder();
