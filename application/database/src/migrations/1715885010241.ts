import { Kysely } from 'kysely';
import { projectTableSetup } from '../helpers/workspace';

export async function up(db: Kysely<any>): Promise<void> {
  const workspaceIds = await db.withSchema('public').selectFrom('workspace').select('id').execute();

  for (const workspaceId of workspaceIds) {
    await projectTableSetup(db as any, `workspace_${workspaceId.id}`);
  }
}

export async function down(db: Kysely<any>): Promise<void> {}
