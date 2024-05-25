import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createSchema('public').ifNotExists().execute();

  await db.withSchema('public').schema.createType('workspace_status').asEnum(['active', 'inactive']).execute();

  await db
    .withSchema('public')
    .schema.createType('member_status')
    .asEnum(['active', 'inactive', 'pending', 'ignored'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropType('member_status').execute();
  await db.schema.dropType('workspace_status').execute();
}
