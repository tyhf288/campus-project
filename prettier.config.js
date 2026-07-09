/**
 * @type {import('prettier').Config}
 * 全局统一代码格式化配置，所有apps/packages自动向上读取
 */
export default {
  // 使用单引号
  singleQuote: true,
  // 语句末尾不加分号
  semi: false,
  // 缩进2空格
  tabWidth: 2,
  // 换行宽度，超过自动折行
  printWidth: 100,
  // 对象数组最后一项添加逗号
  trailingComma: 'es5',
  // html标签换行规则
  htmlWhitespaceSensitivity: 'css',
  // 箭头函数参数始终带括号
  arrowParens: 'always',
  // 换行符统一lf
  endOfLine: 'lf',
  // vue文件script/style标签缩进
  vueIndentScriptAndStyle: false,
  // 格式化时不自动修改引号
  quoteProps: 'as-needed',
}
