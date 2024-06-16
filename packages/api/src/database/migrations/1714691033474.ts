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
    .addColumn('status', 'workspace_status' as any, (col) => col.notNull().defaultTo('active'))
    .addColumn('config', 'json', (col) => col.notNull())
    .execute();

  await db
    .withSchema('public')
    .schema.createTable('workspace_member')
    .addColumn('workspace_id', 'uuid', (col) =>
      col.references('workspace.id').notNull().onUpdate('cascade').onDelete('cascade')
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.references('auth.users.id').notNull().onUpdate('cascade').onDelete('cascade')
    )
    .addColumn('added_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('status', 'member_status' as any, (col) => col.notNull())
    .addPrimaryKeyConstraint('public_workspace_member_pkey', ['workspace_id', 'user_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('workspace').execute();
  await db.schema.dropTable('workspace_member').execute();
}
