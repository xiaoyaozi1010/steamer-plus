const path = require('path');
const presetEnv = require('postcss-preset-env');
const postcssAsset = require('postcss-assets');
const config = require('./scripts/config');

module.exports = {
    plugins: [
        presetEnv({
            browsers: ['iOS 7', '> 0.1%', 'android 2.1'],
            autoprefixer: {}
        }),
        postcssAsset({
            loadPaths: [path.join(config.default.context, './src')],
        }),
    ]
};
