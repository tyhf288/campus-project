import { Migration } from '@mikro-orm/migrations'

export class Migration20260724085405 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop table if exists "todo" cascade;`)
  }

  override async down(): Promise<void> {
    this.addSql(
      `create table "todo" ("id" serial primary key, "title" varchar(255) not null, "content" text not null, "is_complete" boolean not null);`
    )
  }
}
