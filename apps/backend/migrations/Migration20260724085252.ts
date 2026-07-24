import { Migration } from '@mikro-orm/migrations'

export class Migration20260724085252 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "userManagement";`)
    this.addSql(
      `create table "userManagement"."blacklist" ("id" serial primary key, "user_id" int not null, "reason" varchar(500) not null, "operator_id" int not null, "created_at" timestamptz not null, "unbanned_at" timestamptz null, "unbanned_by_id" int null, "unbanned_date" timestamptz null);`
    )

    this.addSql(
      `create table "todo" ("id" serial primary key, "title" varchar(255) not null, "content" text not null, "is_complete" boolean not null);`
    )

    this.addSql(
      `create table "userManagement"."user" ("id" serial primary key, "login_key" varchar(255) not null, "password" varchar(255) null, "nickname" varchar(255) not null, "avatar" varchar(255) null, "email" varchar(255) null, "status" text check ("status" in ('ACTIVE', 'DISABLED')) not null default 'ACTIVE', "role" text check ("role" in ('ADMIN', 'AUDITOR', 'STUDENT')) not null default 'STUDENT', "terminal" text check ("terminal" in ('PC_ADMIN', 'MINI_PROGRAM')) null, "created_at" timestamptz not null, "updated_at" timestamptz null);`
    )
    this.addSql(
      `alter table "userManagement"."user" add constraint "user_login_key_unique" unique ("login_key");`
    )

    this.addSql(`drop table if exists "black" cascade;`)

    this.addSql(`drop table if exists "user" cascade;`)
  }

  override async down(): Promise<void> {
    this.addSql(
      `create table "black" ("id" serial primary key, "user_id" int4 not null, "reason" varchar(500) not null, "operator_id" int4 not null, "created_at" timestamptz(6) not null, "unbanned_at" timestamptz(6) null, "unbanned_by_id" int4 null, "unbanned_date" timestamptz(6) null);`
    )

    this.addSql(
      `create table "user" ("id" serial primary key, "email" varchar(255) null, "password" varchar(255) null, "login_key" varchar(255) not null, "nickname" varchar(255) not null, "avatar" varchar(255) null, "status" text check ("status" in ('ACTIVE', 'DISABLED')) not null default 'ACTIVE', "role" text check ("role" in ('ADMIN', 'AUDITOR', 'STUDENT')) not null default 'STUDENT', "terminal" text check ("terminal" in ('PC_ADMIN', 'MINI_PROGRAM')) null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) null);`
    )
    this.addSql(`alter table "user" add constraint "user_login_key_unique" unique ("login_key");`)

    this.addSql(`drop table if exists "userManagement"."blacklist" cascade;`)

    this.addSql(`drop table if exists "todo" cascade;`)

    this.addSql(`drop table if exists "userManagement"."user" cascade;`)

    this.addSql(`drop schema if exists "userManagement";`)
  }
}
