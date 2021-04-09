import TerserPlugin from 'terser-webpack-plugin';
import isWsl from 'is-wsl';
import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { IBuildOptions } from '../../utils/interface';


export const getOptimization = (options?: IBuildOptions) => ({
    chunkIds: 'named',
    moduleIds: 'named',
    minimize: (options && !options.isDev) || false,
    runtimeChunk: true,
    minimizer: [
        new TerserPlugin({
            extractComments: false,
            terserOptions: {
                sourceMap: true,
                parse: {
                    ecma: 5,
                },
                compress: {
                    ecma: 5,
                    comparisons: false,
                    inline: 2,
                    dead_code: true,
                },
                mangle: {
                    safari10: true,
                },
                output: {
                    ecma: 5,
                    comments: false,
                    ascii_only: true,
                },
            },
            parallel: !isWsl,
        }),
        new CSSMinimizerPlugin(),
    ],
    splitChunks: {
        chunks: 'all',
        name: false
    },
});
