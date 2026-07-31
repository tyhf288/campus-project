/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<object, object, any>
  export default component
}

declare module 'uview-plus' {
  import type { App } from 'vue'
  const uviewPlus: {
    install: (app: App) => void
  }
  export default uviewPlus
}
