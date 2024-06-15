import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const workspaceIds = await db.withSchema('public').selectFrom('workspace').select('id').execute();

  for (const workspaceId of workspaceIds) {
    await updateMemberStatusColumn(db as any, workspaceId.id);
  }
}

export async function down(db: Kysely<any>): Promise<void> {}

async function updateMemberStatusColumn(db: Kysely<any>, workspaceId: string) {
  await db.withSchema(`workspace_${workspaceId}`).schema.alterTable('workspace_member').dropColumn('status').execute();
}
