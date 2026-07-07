import { defineConfig } from "tsup";

export default defineConfig({
  // 入口文件,单入口/多入口
  entry: ["src/index.ts"],
  // 输出格式:cjs(CommonJS) + esm(ES模块),可选iife浏览器自执行
  format: ["cjs", "esm"],
  // 自动生成 .d.ts 类型声明文件，并禁用 composite 模式
  dts: {
    compilerOptions: {
      composite: false,
    },
  },
  // 打包前清空dist文件夹
  clean: true,
  // 输出目录
  outDir: "dist",
  // 指定 tsconfig 文件路径
  tsconfig: "./tsconfig.json",
});