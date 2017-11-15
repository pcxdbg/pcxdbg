const path = require('path');
const webpack = require('webpack');
const childProcess = require('child_process');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const ConcatPlugin = require('webpack-concat-plugin');
const {NoEmitOnErrorsPlugin, LoaderOptionsPlugin, DefinePlugin, HashedModuleIdsPlugin} = require('webpack');
const {CommonsChunkPlugin, UglifyJsPlugin} = require('webpack').optimize;

const nodeModules = path.join(process.cwd(), 'node_modules');
const entryPoints = ['inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main'];
const baseHref = '';
const deployUrl = '';
const isRelease = (process.env.NODE_ENV === 'release');
const styles = [
    './src/pcxdbg.scss'
];
const scripts = [
];
let style_paths = styles.map(style_src => path.join(process.cwd(), style_src));

function getPlugins() {
    var plugins = [];
    var revisionId = childProcess.execSync('git rev-parse --short=10 --verify HEAD').toString().replace(/\r?\n|\r/g, '');
    var revisionNumber = childProcess.execSync('git rev-list HEAD --count').toString().replace(/\r?\n|\r/g, '');
    var buildTime = new Date().getTime();

    plugins.push(new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('release'),
        'process.env.REVISION_ID': JSON.stringify(revisionId),
        'process.env.REVISION_NUMBER': JSON.stringify(revisionNumber),
        'process.env.BUILD_TIME': JSON.stringify(buildTime)
    }));

    plugins.push(new NoEmitOnErrorsPlugin());

    if (scripts.length > 0) {
        plugins.push(new ConcatPlugin({
            uglify: false,
            sourceMap: true,
            name: 'scripts',
            fileName: '[name].bundle.js',
            filesToConcat: scripts
        }));

        plugins.push(new InsertConcatAssetsWebpackPlugin([
            'scripts'
        ]));
    }

    plugins.push(new ProgressPlugin());

    plugins.push(new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: './index.html',
        hash: false,
        inject: true,
        compile: true,
        favicon: false,
        minify: false,
        cache: true,
        showErrors: true,
        chunks: 'all',
        excludeChunks: [],
        title: 'pcxdbg',
        xhtml: true,
        chunksSortMode: (left, right) => {
            let leftIndex = entryPoints.indexOf(left.names[0]);
            let rightindex = entryPoints.indexOf(right.names[0]);
            if (leftIndex > rightindex) {
                return 1;
            } else if (leftIndex < rightindex) {
                return -1;
            } else {
                return 0;
            }
        }
    }));

    plugins.push(new CommonsChunkPlugin({
        name: 'inline',
        minChunks: null
    }));

    plugins.push(new CommonsChunkPlugin({
        name: 'vendor',
        minChunks: module => module.resource && module.resource.startsWith(nodeModules),
        chunks: [
            'main'
        ]
    }));

    plugins.push(new ExtractTextPlugin({
        filename: '[name].bundle.css',
        disable: true
    }));

    plugins.push(new CopyWebpackPlugin([{
        from: 'src/**/*.svg',
        to: './images/',
        flatten: true
    }, {
        from: 'src/lng/**/*.json',
        to: './translations/',
        flatten: true
    }]));

    plugins.push(new LoaderOptionsPlugin({
        sourceMap: false,
        options: {
            postcss: [
                autoprefixer(),
                postcssUrl({
                    url: obj => {
                        if (!obj.url.startsWith('/') || obj.url.startsWith('//')) {
                            return obj.url;
                        }

                        if (deployUrl.match(/:\/\//)) {
                            return `${deployUrl.replace(/\/$/, '')}${obj.url}`;
                        } else if (baseHref.match(/:\/\//)) {
                            return baseHref.replace(/\/$/, '') + `/${deployUrl}/${obj.url}`.replace(/\/\/+/g, '/');
                        } else {
                            return `/${baseHref}/${deployUrl}/${obj.url}`.replace(/\/\/+/g, '/');
                        }
                    }
                })
            ],
            sassLoader: {
                sourceMap: false,
                includePaths: []
            },
            context: ''
        }
    }));

    if (isRelease) {
        plugins.push(new HashedModuleIdsPlugin({
            hashFunction: 'md5',
            hashDigest: 'base64',
            hashDigestLength: 4
        }));

        plugins.push(new UglifyJsPlugin({
            mangle: {
                screw_ie8: true
            },
            compress: {
                screw_ie8: true,
                warnings: false
            },
            sourceMap: false
        }));
    } else {

    }

    return plugins;
}

module.exports = {
    devtool: 'source-map',
    externals: {
        electron: "require('electron')",
        buffer: "require('buffer')",
        child_process: "require('child_process')",
        crypto: "require('crypto')",
        events: "require('events')",
        fs: "require('fs')",
        http: "require('http')",
        https: "require('https')",
        assert: "require('assert')",
        dns: "require('dns')",
        net: "require('net')",
        os: "require('os')",
        path: "require('path')",
        querystring: "require('querystring')",
        readline: "require('readline')",
        repl: "require('repl')",
        stream: "require('stream')",
        string_decoder: "require('string_decoder')",
        url: "require('url')",
        util: "require('util')",
        zlib: "require('zlib')"
    },
    resolve: {
        extensions: [
            '.ts',
            '.js',
            '.scss',
            '.json'
        ],
        aliasFields: [],
        alias: {
            environments: isRelease ? path.resolve(__dirname, 'src/environments/index.release.ts') : path.resolve(__dirname, 'src/environments/index.ts')
        },
        modules: [
            './node_modules'
        ]
    },
    resolveLoader: {
        modules: [
            './node_modules'
        ]
    },
    entry: {
        main: [
            './src/main.ts'
        ],
        polyfills: [
            './src/polyfills.ts'
        ],
        styles: styles
    },
    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    module: {
        rules: [{
            enforce: 'pre',
            test: /\.(js|ts)$/,
            loader: 'source-map-loader',
            exclude: [
                /\/node_modules\//
            ]
        }, {
            test: /\.html$/,
            loader: 'html-loader'
        }, {
            exclude: style_paths,
            test: /\.css$/,
            loaders: [
                'exports-loader?module.exports.toString()',
                'css-loader?{"sourceMap":false,"importLoaders":1,"url":false}',
                'postcss-loader'
            ]
        }, {
            exclude: style_paths,
            test: /\.scss$|\.sass$/,
            loaders: [
                'exports-loader?module.exports.toString()',
                'css-loader?{"sourceMap":false,"importLoaders":1,"url":false}',
                'postcss-loader',
                'sass-loader'
            ]
        }, {
            include: style_paths,
            test: /\.css$/,
            loaders: ExtractTextPlugin.extract({
                use: [
                    'css-loader?{"sourceMap":false,"importLoaders":1,"url":false}',
                    'postcss-loader'
                ],
                fallback: 'style-loader',
                publicPath: ''
            })
        }, {
            include: style_paths,
            test: /\.scss$|\.sass$/,
            loaders: ExtractTextPlugin.extract({
                use: [
                    'css-loader?{"sourceMap":false,"importLoaders":1,"url":false}',
                    'postcss-loader',
                    'sass-loader'
                ],
                fallback: 'style-loader',
                publicPath: ''
            })
        }, {
            test: /\.ts$/,
            loader: 'ts-loader'
        }]
    },
    plugins: getPlugins(),
    node: {
        fs: 'empty',
        global: true,
        crypto: 'empty',
        tls: 'empty',
        net: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false,
        __dirname: false,
        __filename: false
    }
};
