'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = defaultSettings.title || '后台管理系统' // 页面标题

const port = process.env.port || process.env.npm_config_port || 9528 // 服务端口号

// 所有配置说明可在 https://cli.vuejs.org/config/ 中查找
module.exports = {
    // Detail: https://cli.vuejs.org/config/#publicpath
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        // 配置代理跨域
        proxy: {
            '/dev-api': {
                target: 'http://gmall-h5-api.atguigu.cn',
                changeOrigin: true,
                pathRewrite: {
                    '^/dev-api': ''
                }
            }
        },
        // 开启mock数据
        after: require('./mock/mock-server.js')
    },
    configureWebpack: {
        // 在webpack的名称字段中提供应用程序的标题，以便可以在index.html访问它以注入正确的标题。
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    chainWebpack(config) {
        // 它可以提高第一屏的速度，建议打开预载
        config.plugin('preload').tap(() => [{
            rel: 'preload',
            // 忽略 runtime.js
            // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
            fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
            include: 'initial'
        }])

        // 页面多的时候会造成太多无意义的请求
        config.plugins.delete('prefetch')

        // 设置 svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            // `runtime` 必须与 runtimeChunk 名称一致  默认 `runtime`
                            inline: /runtime\..*\.js$/
                        }])
                        .end()
                    config
                        .optimization.splitChunks({
                            chunks: 'all',
                            cacheGroups: {
                                libs: {
                                    name: 'chunk-libs',
                                    test: /[\\/]node_modules[\\/]/,
                                    priority: 10,
                                    chunks: 'initial' // 仅打包最初依赖的第三方
                                },
                                elementUI: {
                                    name: 'chunk-elementUI', // 将elementUI拆分到单个包中
                                    priority: 20, // 权重需要大于libs和app，否则将被打包到libs或app中
                                    test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 为了适应cnpm
                                },
                                commons: {
                                    name: 'chunk-commons',
                                    test: resolve('src/components'), // 可以自定义规则
                                    minChunks: 3, // 最小公约数
                                    priority: 5,
                                    reuseExistingChunk: true
                                }
                            }
                        })
                        // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
                    config.optimization.runtimeChunk('single')
                }
            )
    }
}