import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db
    .withSchema('public')
    .schema.alterTable('workspace_member')
    .dropConstraint('workspace_member_user_id_fkey')
    .execute();
  await db
    .withSchema('public')
    .schema.alterTable('workspace_member')
    .addForeignKeyConstraint('workspace_member_user_id_fkey', ['user_id'], 'auth.users', ['id'])
    .onUpdate('cascade')
    .onDelete('cascade')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {}
