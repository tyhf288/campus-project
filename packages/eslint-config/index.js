import vue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

/**
 * ESLint 扁平配置（Flat Config ESLint9+）
 * 全项目公共基础规则，apps、packages统一继承
 */
export default [
  // 1. 全局忽略配置：替代 .eslintignore
  {
    ignores: [
      'dist/**', // 编译产物目录
      'node_modules/**', // 依赖包
      '*.d.ts', // 类型声明文件不校验
      'vite.config.*', // 构建配置文件跳过
      'turbo/**',
    ],
  },

  // 官方TS推荐规则集
  ...tseslint.configs.recommended,
  // Vue3 官方推荐规则集 - 兼容不同版本的 eslint-plugin-vue
  ...(vue.configs?.['vue3-recommended'] || []),

  {
    // 匹配所有 ts / vue / js 文件
    files: ['**/*.{ts,js,vue}'],

    // 注册插件
    plugins: {
      vue, // vue 语法校验插件
      '@typescript-eslint': tseslint.plugin, // ts语法校验
      prettier, // 整合prettier格式化校验
    },

    // 解析器全局配置
    languageOptions: {
      ecmaVersion: 'latest', // 支持最新ES语法
      sourceType: 'module', // 全局使用ESM模块规范
      // 外层解析器，处理vue单文件
      parser: (await import('vue-eslint-parser')).default,
      parserOptions: {
        // vue内部ts解析器
        parser: tseslint.parser,
        ecmaVersion: 'latest',
      },
      // 全局内置变量，无需提前定义
      globals: {
        uni: 'readonly', // uni-app全局对象
        wx: 'readonly', // 小程序全局对象
        window: 'readonly',
        document: 'readonly',
      },
    },

    // 自定义校验规则：off 关闭 warn警告 error报错
    rules: {
      // ========== 适配 NestJS/CJS 规则 ==========
      // 允许 require 导入（NestJS CJS 环境需要）
      '@typescript-eslint/no-require-imports': 'off',
      // 允许 __dirname / __filename（CJS 核心变量）
      'no-__dirname': 'off',
      // 不强制全文件使用 ESM 的 export
      '@typescript-eslint/prefer-default-export': 'off',


      // ========== TS 规则 ==========
      // 允许any类型，仅警告不阻断开发
      '@typescript-eslint/no-explicit-any': 'warn',
      // 允许空函数
      '@typescript-eslint/no-empty-function': 'off',
      // 不强制函数显式声明返回值类型
      '@typescript-eslint/explicit-function-return-type': 'off',
      // 未使用变量警告
      '@typescript-eslint/no-unused-vars': ['warn'],

      // ========== Vue 规则 ==========
      // 关闭强制多单词组件名（页面组件允许Login、Index）
      'vue/multi-word-component-names': 'off',
      // 不允许v-html
      'vue/no-v-html': 'error',
      // 允许自闭合标签和普通标签两种写法
      'vue/html-self-closing': 'off',
      // 关闭强制标签闭合风格
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-closing-bracket-spacing': 'off',

      // ========== JS 通用规则 ==========
      // console仅保留warn/error，普通log警告提示
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // 禁止未使用普通js变量（交给ts规则接管，关闭）
      'no-unused-vars': 'off',

      // ========== Prettier 整合规则 ==========
      // 格式化不符合规范直接报warn，自动可修复
      'prettier/prettier': 'warn',
    },
  },
]
