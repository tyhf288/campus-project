import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

const resolveAlias = (p: string) => path.resolve(__dirname, p).replace(/\\/g, '/')
const nodeModules = resolveAlias('node_modules/')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [typeof uni === 'function' ? uni() : (uni as any).default()],
  css: {
    preprocessorOptions: {
      scss: {
        // includePaths 让 Sass 可以解析 node_modules 路径
        includePaths: [nodeModules],
        // uview-plus 组件内部使用了 @include flex() 等 mixin，需要提前注入
        additionalData: [
          `@import "uview-plus/theme.scss";`,
          `@import "${resolveAlias('src/assets/style/theme.scss')}";`,
        ].join('\n') + '\n',
        silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin'],
      },
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 500,
    },
  },
})
