import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
  //使用PostgreSQL数据库
  driver: PostgreSqlDriver,

  // 基于文件夹自动扫描实体文件,匹配通用后缀命名
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  // 使用 ts-morph 元数据解析器,替代默认的 reflect-metadata 方案
  metadataProvider: TsMorphMetadataProvider,
  // 开启调试模式,打印执行的SQL语句与实体扫描日志
  debug: true,
  // 迁移配置
  migrations: {
    tableName: 'mikro_orm_migrations', // 迁移记录表名
    path: './migrations', // 迁移文件存放路径
    transactional: true, // 是否在事务中运行迁移
    disableForeignKeys: false, // 是否禁用外键约束
    allOrNothing: true, // 是否全部成功或全部回滚
    dropTables: true, // 是否允许删除表
    safe: false, // 是否启用安全模式
    snapshot: true, // 是否生成快照
  },
  seeder: {
    path: './src/seeders', // 种子文件存放路径
    pathTs: undefined, // TypeScript 种子文件路径（如果使用，应将编译后的文件路径放在 `path` 中）
    defaultSeeder: 'DatabaseSeeder', // 默认种子类名称
    glob: '!(*.d).{js,ts}', // 种子文件匹配规则（所有 .js 和 .ts 文件，但不包括 .d.ts）
    emit: 'ts', // 种子文件生成模式
    fileName: (className: string) => className, // 种子文件命名约定
  },
};

export default config;
