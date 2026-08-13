import { Migration } from '@mikro-orm/migrations'

export class Migration20260809041511 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "goodsManage"."image" alter column "image_url" type varchar(512) using ("image_url"::varchar(512));`
    )
    this.addSql(`alter table "goodsManage"."image" alter column "image_url" drop not null;`)
    this.addSql(
      `alter table "goodsManage"."image" alter column "is_main" type boolean using ("is_main"::boolean);`
    )
    this.addSql(`alter table "goodsManage"."image" alter column "is_main" drop not null;`)
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "goodsManage"."image" alter column "image_url" type varchar(512) using ("image_url"::varchar(512));`
    )
    this.addSql(`alter table "goodsManage"."image" alter column "image_url" set not null;`)
    this.addSql(
      `alter table "goodsManage"."image" alter column "is_main" type boolean using ("is_main"::boolean);`
    )
    this.addSql(`alter table "goodsManage"."image" alter column "is_main" set not null;`)
  }
}
