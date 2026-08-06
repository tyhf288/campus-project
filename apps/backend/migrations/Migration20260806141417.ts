import { Migration } from '@mikro-orm/migrations'

export class Migration20260806141417 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "goodsManage";`)
    this.addSql(
      `create table "goodsManage"."category" ("id" serial primary key, "name" varchar(255) not null, "sort" int not null, "enable" boolean not null, "create_at" timestamptz not null, "update_at" timestamptz null);`
    )

    this.addSql(
      `create table "goodsManage"."collect" ("id" serial primary key, "user_id" bigint not null, "goods_id" bigint not null, "create_at" timestamptz not null default now());`
    )

    this.addSql(
      `create table "goodsManage"."good" ("id" serial primary key, "user_id" bigint not null, "is_anonymous" boolean not null default false, "category_id" bigint not null, "title" varchar(128) not null, "desc" text not null, "price" numeric(10,2) not null, "original_price" numeric(10,2) null, "quality" text check ("quality" in ('new', 'anew', 'normal', 'slight_used', 'old')) not null, "place" varchar(128) null, "status" text check ("status" in ('pending', 'approved', 'rejected', 'reserved', 'sold', 'offline')) not null default 'pending', "reject_reason" varchar(256) not null, "view_count" int not null default 0, "collect_count" int not null default 0, "message_count" int not null default 0, "is_top" boolean not null default false, "create_at" timestamptz not null default now(), "update_at" timestamptz not null);`
    )

    this.addSql(
      `create table "goodsManage"."image" ("id" serial primary key, "goods_id" bigint not null, "image_url" varchar(512) not null, "is_main" boolean not null default false, "create_at" timestamptz not null default now());`
    )

    this.addSql(
      `create table "goodsManage"."message" ("id" serial primary key, "goods_id" bigint not null, "user_id" bigint not null, "parent_id" bigint null, "content" text not null, "create_at" timestamptz not null default now());`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "goodsManage"."category" cascade;`)

    this.addSql(`drop table if exists "goodsManage"."collect" cascade;`)

    this.addSql(`drop table if exists "goodsManage"."good" cascade;`)

    this.addSql(`drop table if exists "goodsManage"."image" cascade;`)

    this.addSql(`drop table if exists "goodsManage"."message" cascade;`)

    this.addSql(`drop schema if exists "goodsManage";`)
  }
}
