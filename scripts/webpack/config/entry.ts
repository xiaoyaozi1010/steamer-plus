import path from 'path';
import fs from 'fs';
import { IBuildOptions } from '../../utils/interface'
import config from '../../config'
import sysLog from './../../utils/sys-log';
import syslog from './../../utils/sys-log';

const cwd = process.cwd();

export const getEntry = (options: IBuildOptions) => {
    const entryDir = path.isAbsolute(config.entryDir) ? config.entryDir : path.join(cwd, config.entryDir);
    const { platform } = options;
    if (!fs.existsSync(entryDir)) {
        sysLog.error('未能找到 webpack entry 入口文件目录');
        process.exit(1);
    };
    const entryFilePath = path.join(entryDir, `${platform}`);
    // 构造文件路径正则，来确定文件后缀名
    const reg = new RegExp(entryFilePath, 'ig');
    const entryFile = fs.readdirSync(entryDir)
        // 拼接真实绝对路径
        .map(fileName => path.join(entryDir, fileName))
        // 过滤符合入口文件名规范的文件
        .filter(file => reg.test(file))
        // 确保文件或目录存在
        .filter(filePath => fs.existsSync(filePath))
        // 拼装合法入口文件路径
        .map(filePath => {
            const allowedFileNames = ['index', 'main'];
            const allowedExtNames = ['.ts', '.tsx', '.js', '.jsx'];
            if (fs.lstatSync(filePath).isDirectory()) {
                const subFile = fs.readdirSync(filePath)
                    // 合法后缀
                    .filter(file => allowedExtNames.includes(path.extname(file)))
                    // 合法文件名
                    .filter((file: string) => allowedFileNames.indexOf(file.split('.').shift() as string) === 0)
                    .shift();
                return subFile ? path.join(filePath, subFile): '';
            }
            return filePath
        })
        // 过滤符合入口文件后缀名规范的文件
        .filter(file => ['.ts', '.tsx', '.js', '.jsx'].includes(path.extname(file)))
        // 只认第一个
        .shift();
    if (!entryFile || !fs.existsSync(entryFile)) {
        syslog.error('入口文件不存在');
        process.exit(1);
    }
    return {
        [platform]: entryFile,
    }
}
