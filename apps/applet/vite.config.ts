import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [typeof uni === 'function' ? uni() : (uni as any).default()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${path.resolve(__dirname, "src/assets/style/theme.scss").replace(/\\/g, "/")}" as *;`,
      },
    },
  },
});