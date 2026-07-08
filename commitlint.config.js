export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 规定允许的提交类型（行业统一标准）
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert'],
    ],
    'type-case': [2, 'always', 'lower-case'], // type必须小写
    'header-max-length': [2, 'always', 100], // 标题最长100字符
    'subject-full-stop': [2, 'never', '.'], // 描述结尾不能带句号
    'subject-case': [0],
  },
}
