import { Migration } from '@mikro-orm/migrations'

export class Migration20260709122158 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_email_unique";`)

    this.addSql(
      `alter table "user" add column "login_key" varchar(255) not null, add column "nickname" varchar(255) not null, add column "avatar" varchar(255) null, add column "status" text check ("status" in ('ACTIVE', 'DISABLED')) not null default 'ACTIVE', add column "role" text check ("role" in ('ADMIN', 'AUDITOR', 'STUDENT')) not null default 'STUDENT', add column "terminal" text check ("terminal" in ('PC_ADMIN', 'MINI_PROGRAM')) null, add column "created_at" timestamptz not null, add column "updated_at" timestamptz null;`
    )
    this.addSql(
      `alter table "user" alter column "email" type varchar(255) using ("email"::varchar(255));`
    )
    this.addSql(`alter table "user" alter column "email" drop not null;`)
    this.addSql(
      `alter table "user" alter column "password" type varchar(255) using ("password"::varchar(255));`
    )
    this.addSql(`alter table "user" alter column "password" drop not null;`)
    this.addSql(`alter table "user" add constraint "user_login_key_unique" unique ("login_key");`)
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_login_key_unique";`)
    this.addSql(
      `alter table "user" drop column "login_key", drop column "nickname", drop column "avatar", drop column "status", drop column "role", drop column "terminal", drop column "created_at", drop column "updated_at";`
    )

    this.addSql(
      `alter table "user" alter column "password" type varchar(255) using ("password"::varchar(255));`
    )
    this.addSql(`alter table "user" alter column "password" set not null;`)
    this.addSql(
      `alter table "user" alter column "email" type varchar(255) using ("email"::varchar(255));`
    )
    this.addSql(`alter table "user" alter column "email" set not null;`)
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`)
  }
}
