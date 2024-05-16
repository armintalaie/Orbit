import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createSchema('public').ifNotExists().execute();

  await db
    .withSchema('public')
    .schema.createTable('workspace')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull().unique())
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('config', 'json', (col) => col.notNull())
    .execute();

  await db
    .withSchema('public')
    .schema.createTable('workspace_member')
    .addColumn('workspace_id', 'uuid', (col) => col.references('workspace.id').notNull())
    .addColumn('user_id', 'uuid', (col) => col.references('auth.users.id').notNull())
    .addColumn('added_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('username', 'varchar', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('workspace').execute();
  await db.schema.dropTable('workspace_member').execute();
}
