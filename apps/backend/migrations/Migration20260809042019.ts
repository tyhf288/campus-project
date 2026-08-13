import { Migration } from '@mikro-orm/migrations'

export class Migration20260809042019 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "goodsManage"."good" alter column "create_at" type timestamptz using ("create_at"::timestamptz);`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "create_at" drop not null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "update_at" type timestamptz using ("update_at"::timestamptz);`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "update_at" drop not null;`)

    this.addSql(
      `alter table "goodsManage"."image" alter column "create_at" type timestamptz using ("create_at"::timestamptz);`
    )
    this.addSql(`alter table "goodsManage"."image" alter column "create_at" drop not null;`)
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "goodsManage"."good" alter column "create_at" type timestamptz(6) using ("create_at"::timestamptz(6));`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "create_at" set not null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "update_at" type timestamptz(6) using ("update_at"::timestamptz(6));`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "update_at" set not null;`)

    this.addSql(
      `alter table "goodsManage"."image" alter column "create_at" type timestamptz(6) using ("create_at"::timestamptz(6));`
    )
    this.addSql(`alter table "goodsManage"."image" alter column "create_at" set not null;`)
  }
}
