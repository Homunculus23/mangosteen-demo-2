import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
// @ts-nocheck
import { svgstore } from "./src/vite_plugins/svgstore";
import styleImport, { VantResolve } from "vite-plugin-style-import";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: any) {
          if (id.includes("echarts")) {
            return "echarts";
          }
          if (id.includes("mock") || id.includes("faker")) {
            return "mock";
          }
          if (id.includes("vant")) {
            return "vant";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  plugins: [
    vue(),
    vueJsx({
      transformOn: true,
      mergeProps: true,
    }),
    svgstore(),
    //Vant UI 插件
    styleImport({
      resolves: [VantResolve()],
      //vant默认路径错误，添加解析文件
      libs: [
        {
          libraryName: "vant",
          esModule: true,
          resolveStyle: (name) => `../es/${name}/style`,
        },
      ],
    }),
  ],
  server: {
    proxy: {
      "/api/v1": {
        target: "http://121.196.236.94:3000/",
      },
    },
  },
});
