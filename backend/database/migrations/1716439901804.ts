import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createSchema('public').ifNotExists().execute();

  await db
    .withSchema('public')
    .schema.alterTable('workspace')
    .alterColumn('id', (col) => col.setDefault(sql`uuid_generate_v4()`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> { 
}
