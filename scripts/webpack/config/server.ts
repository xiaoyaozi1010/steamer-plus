import WebpackDevServer from 'webpack-dev-server';
import path from 'path';
import config from '../../config';
import { IBuildOptions } from '../../utils/interface';
import syslog from '../../utils/sys-log';
import webpack from 'webpack';

export const devServer = (compiler: webpack.Compiler | webpack.MultiCompiler, options: IBuildOptions) => {
    // 配置参考webpack官方devServer配置
    const defaultOpt: WebpackDevServer.Configuration = {
        port: 9000,
        proxy: {},
        open: true,
        contentBase: './dev',
        clientLogLevel: 'silent',
        compress: true,
        disableHostCheck: true,
        historyApiFallback: {
            disableDotRule: true,
        },
        writeToDisk: true,
        hot: true,
        before(app, server, compiler) {
            app.get('/', (req, res, next) => {
                // 自动识别ua，导向mobile或pc页面，不再需要手动切换
                if ((req.headers['user-agent'] as string).toLowerCase().indexOf('mobile') >= 0) {
                    res.status(200).sendFile(path.join(config.context, config.devDir, './mobile.html'));
                    next();
                } else {
                    res.status(200).sendFile(path.join(config.context, config.devDir, './pc.html'));
                    next();
                }
            })
        },
        watchContentBase: true,
        watchOptions: {
            ignored: /node_modules/,
        },
    };
    const serverOptions = Object.assign({}, defaultOpt, config.devServer);
    const { port, host } = serverOptions;
    const server = new WebpackDevServer(compiler, serverOptions);
    server.listen(port, host, err => {
        if (err) {
            syslog.error(err);
            process.exit(1);
        }
        syslog.success('开发服务器已启动...');
    });
    ['SIGINT', 'SIGTERM'].forEach(sig => {
        process.on(sig, function () {
            server.close();
            process.exit();
        });
    });
}
