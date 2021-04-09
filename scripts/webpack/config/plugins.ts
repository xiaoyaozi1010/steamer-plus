import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WriteFilePlugin, { UserOptionsType } from 'write-file-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
// @ts-ignore
import SpritePlugin from 'webpack-spritesmith';
import CompressionAssetsPlugin from 'compression-webpack-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import { IBuildOptions } from "../../utils/interface";
import { PLATFORM } from '../../utils/interface';
import config from '../../config';
import webpack from 'webpack';

interface IWriteFilePlugin extends webpack.WebpackPluginInstance {
    constructor(userOptions?: UserOptionsType): () => void;
}

const createHtmlPlugin = (options: IBuildOptions) => {
    const { isDev, platform = 'pc', outputAlias } = options;
    const htmlFileName = outputAlias[platform] ? outputAlias[platform] : platform;
    console.log(platform);
    return new HtmlWebpackPlugin({
        filename: isDev ? `${htmlFileName}.html` : `webserver/${htmlFileName}.html`,
        template: path.join(config.context, `./public/template/html/${platform}.pug`),
        minify: isDev ? false : {
            html5: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
        },
        inject: false,
        templateParameters(compilation, assets) {
            const { js: jsChunks, css: cssChunks } = assets;
            return {
                title: '腾讯文档',
                jsChunks,
                cssChunks,
                isDev,
                platform,
                env: process.env.NODE_ENV,
                ...config.define,
            }
        },
    });
}

const createSpritePlugin = (): webpack.WebpackPluginInstance => {
    const spriteConfig = {
        src: {
            cwd: path.resolve(config.root, './css/sprites/image'),
            glob: '*.png',
        },
        target: {
            image: path.resolve(config.root, './css/sprites-generated/sprites-image.png'),
            css: [
                [
                    path.resolve(config.root, './css/sprites-generated/sprites.css'),
                    {
                        format: 'css',
                        formatOpts: {
                            cssSelector: (sprite: any) => `.${sprite.name}`,
                        },
                    },
                ],
            ],
        },
        retina: '@2x',
        apiOptions: {
            cssImageRef: '~img/sprites-image.png',
        },
    }
    return new SpritePlugin(spriteConfig);
}

export const getPlugins = (options: IBuildOptions) => {
    const { isDev, platform } = options;
    const plugins: webpack.WebpackPluginInstance[] = [
        // 跨平台路径匹配
        new CaseSensitivePathsPlugin(),
        new CleanWebpackPlugin({
            // 只清理一次，否则多任务模式后面的会把前面的给清理掉
            cleanOnceBeforeBuildPatterns: ['./dist'],
        }),
        new WebpackManifestPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                ...config.define,
                PLATFORM: platform,
                IS_DEV: isDev,
            },
        }),
        createHtmlPlugin(options),
        createSpritePlugin(),
        new CopyWebpackPlugin({
            patterns: typeof config.statics === 'string'
                ? [{
                    context: path.join(config.context, './src'),
                    from: config.statics,
                    to: path.join('./cdn', config.statics, './[name].[ext]'),
                }]
                : config.statics.map((src) => ({
                    context: path.join(config.context, './src'),
                    from: src,
                    to: options.isDev ? path.join(src, './[name].[ext]') : path.join('./cdn', src, './[name].[ext]'),
                })),
            options: { concurrency: 50, },
        }),
        // ts type检查工具，因为使用了babel-loader处理ts文件，所以要单独增加ts检查
        // 这里需要挪到单独的worker里处理
        new ForkTsCheckerPlugin({
            typescript: {
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true,
                },
                mode: "write-references",
            },
            formatter: {
                type: 'codeframe',
                options: {
                    highlightCode: true,
                    forceColor: true,
                },
            },
        }),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: isDev ? [`【开发环境已构建成功，请在浏览器验证效果】`] : ['【生产环境已构建完成】'],
                notes: [''],
            }
        }),
    ];
    if (isDev) {
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
        );
    } else {
        plugins.push(
            // 生产环境抽离css到单独文件
            new MiniCssExtractPlugin({
                filename: 'cdn/css/[name].css',
                chunkFilename: `cdn/css/[${platform}]-[chunkhash].css`,
            }),
            // 压缩静态资源
            new CompressionAssetsPlugin(),
        );
    }
    if (platform === PLATFORM.ANALYZER) {
        plugins.push(new BundleAnalyzerPlugin({
            // 避免启动服务占用更多内存，使用浏览器打开静态文件
            analyzerMode: 'static',
        }));
    }
    return plugins;
}
