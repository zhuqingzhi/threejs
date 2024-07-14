import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";
// 获取当前文件所在的目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
