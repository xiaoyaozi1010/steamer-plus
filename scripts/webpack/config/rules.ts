import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { IBuildOptions } from '../../utils/interface'

// 暂时不用HappyPack来提升性能
// 原因是对于拆分了rules和plugins的配置文件，代码阅读起来比较费劲，
// 并且webpack 4.0之后，多线程编译对webpack性能提升不大
// 如果出现性能瓶颈问题，可以考虑加入happypack
// 使用babel/typescript-preset编译ts和tsx，原因见：https://juejin.cn/post/6844904052094926855

// NOTE: 已使用 HardSourceWebpackPlugin 代替 cache-loader
// https://github.com/webpack-contrib/cache-loader/issues/11#issuecomment-328480598

const includePaths = [
    /\/node_modules\//,
    path.resolve(process.cwd(), './src'),
    path.resolve(process.cwd(), './css/sprites'),
];

const babelLoader = (options: IBuildOptions) => {
    return [
        {
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                cacheIdentifier: !options.isDev ? '.babel_cache' : '',
            },
        }
    ]
}

const cssLoader = (module: boolean = false, options?: IBuildOptions) => {
    return [
        // style-loader和MiniCssExtractPlugin.loader是不可以共存的，二者作用相反
        options && options.isDev ? {
            loader: 'style-loader',
            options: {
                attributes: { id: 'tdoc-global-id' },
            },
        } : MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                modules: module,
                importLoaders: 2,
            }
        },
        'postcss-loader',
    ]
}

export const getRules = (options: IBuildOptions) => {
    return [
        // TODO: 添加eslint
        {
            test: /\.pug$/,
            use: ['pug-loader'],
            include: path.resolve(process.cwd(), './public/template/html'),
        },
        {
            test: /\.html$/,
            use: ['html-loader'],
        },
        {
            test: /\.(t|j)sx?$/,
            use: [
                ...babelLoader(options)
            ],
            exclude: [/node_modules/, /scripts/],
        },
        {
            test: /\.css$/,
            use: [
                ...cssLoader(true, options),
            ],
            sideEffects: true,
            include: includePaths,
        },
        {
            // 不推荐使用 *.global.css 或者 *-global.css，全局样式请使用 :global(.class-name) { ... }
            test: [/-global\.css$/, /\.global\.css$/],
            use: [
                ...cssLoader(true, options),
            ],
            sideEffects: true,
            include: includePaths,
        },
        {
            test: /\.less$/,
            use: [
                ...cssLoader(false, options),
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: !!options.isDev,
                        javascriptEnabled: true,
                    }
                }
            ],
            sideEffects: true,
            include: includePaths,
        },
        {
            test: /\.(jpe?g|png|gif)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.svg$/i,
            type: 'asset/inline',
        },
    ];
}
