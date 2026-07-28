import { Migration } from '@mikro-orm/migrations'

export class Migration20260727035947 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "userManagement"."blacklist" add column "unbanned_reason" varchar(500) null;`
    )

    this.addSql(`alter table "userManagement"."user" add column "openid" varchar(255) null;`)
    this.addSql(
      `alter table "userManagement"."user" add constraint "user_openid_unique" unique ("openid");`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "userManagement"."blacklist" drop column "unbanned_reason";`)

    this.addSql(`alter table "userManagement"."user" drop constraint "user_openid_unique";`)
    this.addSql(`alter table "userManagement"."user" drop column "openid";`)
  }
}
