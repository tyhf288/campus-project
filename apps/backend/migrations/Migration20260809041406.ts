import { Migration } from '@mikro-orm/migrations'

export class Migration20260809041406 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "goodsManage"."good" drop column "original_price";`)

    this.addSql(
      `alter table "goodsManage"."good" alter column "status" type text using ("status"::text);`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "status" drop not null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "reject_reason" type varchar(256) using ("reject_reason"::varchar(256));`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "reject_reason" drop not null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "view_count" type int using ("view_count"::int);`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "view_count" drop not null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "collect_count" type int using ("collect_count"::int);`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "collect_count" drop not null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "message_count" type int using ("message_count"::int);`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "message_count" drop not null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "is_top" type boolean using ("is_top"::boolean);`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "is_top" drop not null;`)
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "goodsManage"."good" add column "original_price" numeric(10,2) null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "status" type text using ("status"::text);`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "status" set not null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "reject_reason" type varchar(256) using ("reject_reason"::varchar(256));`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "reject_reason" set not null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "view_count" type int4 using ("view_count"::int4);`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "view_count" set not null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "collect_count" type int4 using ("collect_count"::int4);`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "collect_count" set not null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "message_count" type int4 using ("message_count"::int4);`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "message_count" set not null;`)
    this.addSql(
      `alter table "goodsManage"."good" alter column "is_top" type bool using ("is_top"::bool);`
    )
    this.addSql(`alter table "goodsManage"."good" alter column "is_top" set not null;`)
  }
}
