import eslintConfig from '@campus/eslint-config'
export default [
  ...eslintConfig,
  {
    // 只作用于后端服务所有 ts 文件
    files: ['src/**/*.ts'],
    languageOptions: {
      // Node 环境，包含 require、module、__dirname、exports 等CJS全局变量
      globals: {
        module: 'readonly',
        exports: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
      },
      // 解析源码依然是 module（我们写代码用 import）
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    rules: {
      // 后端额外放宽规则
      'no-console': 'off', // 后端需要日志打印
    },
  },
]
