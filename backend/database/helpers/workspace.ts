import { Kysely, Transaction } from 'kysely';
import { projectTableSetup } from './project';
import { teamTableSetup } from './team';
import { setupWorkspaceMembersAndRoles } from './member';

type WorkspaceCreateInput = {
  name: string;
  ownerId: string;
  config: Record<string, any>;
};

export async function createWorkspaceTenant(db: Kysely<any>, input: WorkspaceCreateInput) {
  const workspace = await db.transaction().execute(async (trx) => {
    let workspace = await trx
      .withSchema('public')
      .insertInto('workspace')
      .values({
        name: input.name,
        config: input.config,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    console.log('LOG: Workspace entry created');

    await trx
      .withSchema('public')
      .insertInto('workspace_member')
      .values({
        workspace_id: workspace.id,
        user_id: input.ownerId,
        status: 'active',
      })
      .execute();

    console.log('LOG: Workspace member added');

    await setupWorkspaceTables(trx, workspace.id);
    console.log('LOG: Workspace tables setup');
    return workspace;
  });

  console.log('LOG: Workspace created', workspace);

  return workspace;
}

async function setupWorkspaceTables(db: Transaction<any>, workspaceId: string) {
  const workspaceSchema = `workspace_${workspaceId}`;
  await db.schema.createSchema(workspaceSchema).ifNotExists().execute();
  await setupWorkspaceMembersAndRoles(db, workspaceSchema);
  await projectTableSetup(db, workspaceSchema);
  await teamTableSetup(db, workspaceSchema);
}


export async function destroyWorkspaceTenant(db: Kysely<any>, workspaceId: string) {
  const workspaceSchema = `workspace_${workspaceId}`;
  await db.transaction().execute(async (trx) => {
    await trx.withSchema('public').schema.dropSchema(workspaceSchema).ifExists().cascade().execute();

    console.log(`Dropped schema ${workspaceSchema}`);
    await trx.deleteFrom('workspace_member').where('workspace_id', '=', workspaceId).execute();

    console.log(`Deleted workspace members for workspace ${workspaceId}`);
    await trx.deleteFrom('workspace').where('id', '=', workspaceId).execute();

    console.log(`Deleted workspace ${workspaceId}`);
  });
  return workspaceId;
}

