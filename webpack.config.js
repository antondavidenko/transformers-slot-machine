var path = require('path')
var webpack = require('webpack')

// pixi.js webpack config
var pixiJSModule = path.join(__dirname, '/node_modules/pixi.js/')
var pixiJS = path.join(pixiJSModule, 'lib/index.js')
var howlerModule = path.join(__dirname, '/node_modules/howler/')
var howler = path.join(howlerModule, 'dist/howler.js')

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    WEBGL_RENDERER: true,
    CANVAS_RENDERER: true
})

module.exports = {
    entry: {
        app: [path.resolve(__dirname, 'src/app.ts')],
        vendor: ['pixi.js','howler']      
    },
    devtool: 'cheap-source-map',
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/',
        filename: 'index.js'
    },
    watch: true,
    plugins: [
        definePlugin,
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'/* chunkName= */,
            filename: 'libs.js'/* filename= */
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ['babel-loader', 'awesome-typescript-loader'],
                include: path.join(__dirname, 'src'),
            },
            {
                test: [/\.vert$/, /\.frag$/],
                use: 'raw-loader'
            }
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'pixi.js': pixiJS,
            'howler': howler
        }
    }
}