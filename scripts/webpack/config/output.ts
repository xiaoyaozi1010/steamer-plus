import path from 'path';
import { IBuildOptions } from '../../utils/interface';
import config from '../../config'

const cwd = process.cwd();
export const getOutput = ({ isDev }: IBuildOptions) => {
    const convertPath = (dir: string) => path.isAbsolute(dir) ? dir : path.join(cwd, dir)
    const outputPath = isDev ? convertPath('./dev') : convertPath(config.dist);
    return {
        path: outputPath,
        // publicPath: '../cdn/js' || config.publicPath,
        hashDigestLength: 6,
        filename: isDev ? 'js/[name].[contenthash:6].js' : 'cdn/js/[name].[contenthash].js',
        chunkFilename: isDev ? 'js/chunk/[name].js' : 'cdn/js/chunk/[name].[chunkhash:8].js',
        assetModuleFilename: `${isDev ? './dev' : './dist/cdn'}/img/[path][contenthash:6].[ext]`,
    }
}
