const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true, //기존
  //WebPack Image 처리
  // chainWebpack: (config) => {
  //   config.module
  //     .rule("images")
  //     .test(/\.(png|jpe?g|gif|webp|JPG)(\?.*)?$/)
  //     .use("file-loader")
  //     .loader("file-loader")
  //     .options({
  //       name: "img/[name].[hash:8].[ext]",
  //     })
  //     .end();
  // },
});
