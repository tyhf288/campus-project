import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

const resolveAlias = (p: string) => path.resolve(__dirname, p).replace(/\\/g, '/')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [typeof uni === 'function' ? uni() : (uni as any).default()],
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [resolveAlias('src/')],
        silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin'],
      },
    },
  },
})
