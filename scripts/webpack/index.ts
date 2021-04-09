import path from 'path';
import { Configuration } from 'webpack';
import config from '../config';
import { IBuildOptions } from '../utils/interface';
import { getEntry } from './config/entry';
import { getOutput } from './config/output';
import { getRules } from './config/rules';
import { getPlugins } from './config/plugins';
import { getOptimization } from "./config/optimization";
import { devServer } from './config/server';

// TODO: 编译速度和体积优化

export const getWebpackConfig = (options: IBuildOptions): Configuration => {
    return {
        bail: !options.isDev,
        mode: !options.isDev ? 'production' : 'development',
        devtool: options.isDev ? 'inline-source-map' : 'source-map',
        // name: options.platform,
        // context: path.join(process.cwd(), './src'),
        entry: getEntry(options),
        output: getOutput(options),
        resolve: {
            modules: [
                'node_modules',
                path.resolve(config.context, 'node_modules'),
            ],
            extensions: ['.mjs','.js','.ts','.tsx','.json','.jsx'],
            alias: {
                '@': config.root,
            },
        },
        module: {
            strictExportPresence: true,
            rules: getRules(options),
        },
        plugins: getPlugins(options),
        optimization: getOptimization(options) as Configuration['optimization'],
        node: false,
    }
}
