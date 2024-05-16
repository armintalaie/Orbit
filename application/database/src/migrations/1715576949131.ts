import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createType('workspace_member_status').asEnum(['active', 'pending', 'blocked']).execute();
  await db.schema
    .alterTable('workspaceMember')
    .addColumn('status', 'workspace_member_status' as any, (col) => col.notNull().defaultTo('active'))
    .dropColumn('username')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('workspaceMember').dropColumn('status').addColumn('username', 'text').execute();
  await db.schema.dropType('workspaceMemberStatus').execute();
}
1715576949131;
