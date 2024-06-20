const path = require("path");

const CompressionWebpackPlugin = require("compression-webpack-plugin");

const TerserPlugin = require("terser-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: process.env.CDN_URL,
  lintOnSave: false,
  productionSourceMap: false,
  transpileDependencies: [/@walletconnect/],
  chainWebpack: (config) => {
    config.plugins.delete("prefetch");

    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("router", resolve("src/router"))
      .set("store", resolve("src/store"))
      .set("views", resolve("src/views"))
      .set("bn.js", path.resolve("node_modules", "bn.js"));

    // vue-svg-loader
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.exclude.add(/node_modules/);
    svgRule
      .test(/\.svg$/)
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });

    const imagesRule = config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
    imagesRule.uses.clear();
    imagesRule.exclude.add(resolve("src/icons"));
    imagesRule
      .use("file-loader")
      .loader("url-loader")
      .options({
        limit: 10240,
        fallback: {
          loader: "file-loader",
          options: {
            outputPath: "images",
          },
        },
      });

    config.optimization.minimize(true);
  },
  configureWebpack: (config) => {
    // config.externals = {
    // 	'element-ui': 'ELEMENT',
    // 	vue: 'Vue',
    // 	'vue-router': 'VueRouter',
    // 	vuex: 'Vuex',
    // 	axios: 'axios',
    // 	dayjs: 'dayjs',
    // 	echarts: 'echarts'
    // }

    // console.log
    // if (process.env.VUE_APP_VERSION === "prod") {
    //   config.plugins.push(
    //     new TerserPlugin({
    //       terserOptions: {
    //         ecma: undefined,
    //         warnings: false,
    //         parse: {},
    //         compress: {
    //           drop_console: true,
    //           drop_debugger: false,
    //           pure_funcs: ["console.log"],
    //         },
    //       },
    //     })
    //   );
    // }

    // gzip
    config.plugins.push(
      new CompressionWebpackPlugin({
        algorithm: "gzip",
        test: /\.js$|\.html$|\.css$/,
        filename: "[path].gz[query]",
        minRatio: 1,
        threshold: 10240,
        deleteOriginalAssets: false,
      })
    );
  },
  devServer: {
    // port: 80,
    disableHostCheck: process.env.CDN_URL === "",
    proxy:
      process.env.NODE_ENV === "development"
        ? {
          "/api": {
            target: "https://test-api.protodao.io",
            secure: true,
            changeOrigin: true,
            // pathRewrite: {
            //   "^/api": "/",
            // },
            // cookieDomainRewrite: {
            //   "https://test.protodao.io": "localhost",
            // },
          },
          "/dex-api": {
            target: "https://test-api.protodao.io",
            secure: true,
            changeOrigin: true,
          },
        }
        : {},
  },
};
