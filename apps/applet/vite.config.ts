import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

const resolveAlias = (p: string) => path.resolve(__dirname, p).replace(/\\/g, '/')
const nodeModules = resolveAlias('node_modules/')
const srcDir = resolveAlias('src/')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [typeof uni === 'function' ? uni() : (uni as any).default()],
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [nodeModules, srcDir],
        silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin'],
        // uview-plus 组件内部使用 @include flex() 等 mixin，需要在每个 .vue 中注入
        // uni.scss 无法影响 node_modules 中的组件，只能用 additionalData
        additionalData: `@import "uview-plus/theme.scss";\n`,
      },
    },
  },
})
