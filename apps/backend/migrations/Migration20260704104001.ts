import { Migration } from '@mikro-orm/migrations'

export class Migration20260704104001 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "todo" ("id" serial primary key, "title" varchar(255) not null, "content" varchar(255) not null, "is_complete" boolean not null);`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "todo" cascade;`)
  }
}
