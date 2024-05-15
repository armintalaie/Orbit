import { Kysely, Transaction, sql } from 'kysely';

type WorkspaceCreateInput = {
  name: string;
  ownerId: string;
  config: Record<string, any>;
};

async function createWorkspaceTenant(
  db: Kysely<any>,
  input: WorkspaceCreateInput
) {
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
      })
      .execute();

    console.log('LOG: Workspace member added');

    await setupWorkspaceTables(trx, workspace.id);
    console.log('LOG: Workspace tables setup');

    await createStarterRoles(trx, workspace.id, input.ownerId);
    await addCreaterToWorkspace(trx, workspace.id, input.ownerId);
    console.log('LOG: Starter roles created');

    return workspace;
  });

  console.log('LOG: Workspace created', workspace);

  return workspace;
}

async function setupWorkspaceTables(db: Transaction<any>, workspaceId: string) {
  const workspaceSchema = `workspace_${workspaceId}`;
  await db.schema.createSchema(workspaceSchema).ifNotExists().execute();
  await setupWorkspacePermissionsAndRoles(db, workspaceSchema);
  await setupWorkspaceTeamTable(db, workspaceSchema);
}

async function createStarterRoles(
  db: Transaction<any>,
  workspaceId: string,
  ownerId: string
) {
  const starterRoles = [
    { name: 'owner', description: 'Owner of the workspace' },
    { name: 'admin', description: 'Admin of the workspace' },
    { name: 'member', description: 'Member of the workspace' },
  ];

  const workspaceSchema = `workspace_${workspaceId}`;
  await db
    .withSchema(workspaceSchema)
    .insertInto('role')
    .values(starterRoles)
    .execute();

  await db
    .withSchema(workspaceSchema)
    .insertInto('role_permission')
    .values([
      { role_name: 'owner', permission: 'admin', entity: 'workspace' },
      { role_name: 'owner', permission: 'delete', entity: 'workspace' },
      { role_name: 'admin', permission: 'admin', entity: 'workspace' },
      { role_name: 'member', permission: 'read', entity: 'workspace' },
    ])
    .execute();
}

async function addCreaterToWorkspace(
  db: Kysely<any>,
  workspaceId: string,
  ownerId: string
) {
  const workspaceSchema = `workspace_${workspaceId}`;

  await db
    .withSchema(workspaceSchema)
    .insertInto('workspaceMember')
    .values({
      memberId: ownerId,
      addedAt: new Date(),
      updatedAt: new Date(),
      username: ownerId,
    })
    .execute();

  await db
    .withSchema(workspaceSchema)
    .insertInto('workspaceMemberRole')
    .values([
      {
        member_id: ownerId,
        role_name: 'owner',
      },
      {
        member_id: ownerId,
        role_name: 'admin',
      },
      {
        member_id: ownerId,
        role_name: 'member',
      },
    ])
    .execute();
}

async function setupWorkspacePermissionsAndRoles(
  db: Kysely<any>,
  workspaceSchema: string
) {
  await db
    .withSchema(workspaceSchema)
    .schema.createTable('role')
    .addColumn('name', 'varchar', (col) => col.primaryKey())
    .addColumn('description', 'text')
    .execute();

  await db
    .withSchema(workspaceSchema)
    .schema.createTable('role_permission')
    .addColumn('role_name', 'varchar', (col) =>
      col
        .references('role.name')
        .notNull()
        .onDelete('cascade')
        .onUpdate('cascade')
    )
    .addColumn('permission', 'permission' as any, (col) => col.notNull())
    .addColumn('entity', 'entity' as any, (col) => col.notNull())
    .addForeignKeyConstraint(
      'permissions',
      ['permission', 'entity'],
      'public.workspace_permission',
      ['permission', 'entity'],
      (cb) => cb.onDelete('cascade').onUpdate('cascade')
    )
    .execute();

  const defaultAvatar =
    'https://vzbnqbrfobqivmismxxj.supabase.co/storage/v1/object/public/profile_photos/default/av5.png';

  await db
    .withSchema(workspaceSchema)
    .schema.createTable('workspace_member')
    .addColumn('member_id', 'uuid', (col) =>
      col.references('auth.users.id').notNull().primaryKey()
    )
    .addColumn('added_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('username', 'varchar', (col) => col.notNull().unique())
    .addColumn('first_name', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('last_name', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('pronouns', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('avatar', 'text', (col) =>
      col.notNull().defaultTo(defaultAvatar)
    )
    .addColumn('location', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('timezone', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('status', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('notes', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('display_name', 'text', (col) => col.notNull().defaultTo(''))

    .execute();

  await db
    .withSchema(workspaceSchema)
    .schema.createTable('workspace_member_role')
    .addColumn('member_id', 'uuid', (col) =>
      col
        .references('workspace_member.member_id')
        .notNull()
        .onDelete('cascade')
        .onUpdate('cascade')
    )
    .addColumn('role_name', 'varchar', (col) =>
      col
        .references('role.name')
        .notNull()
        .onDelete('cascade')
        .onUpdate('cascade')
    )
    .addPrimaryKeyConstraint('primary_key', ['member_id', 'role_name'])
    .execute();
}

async function setupWorkspaceTeamTable(
  db: Kysely<any>,
  workspaceSchema: string
) {
  await db
    .withSchema(workspaceSchema)
    .schema.createTable('team_status')
    .addColumn('name', 'varchar', (col) => col.primaryKey())
    .addColumn('description', 'text')
    .addColumn('meta', 'json', (col) => col.notNull().defaultTo(sql`'{}'`))
    .execute();

  await db
    .withSchema(workspaceSchema)
    .schema.createTable('team')
    .addColumn('name', 'varchar', (col) => col.primaryKey())
    .addColumn('id', 'uuid', (col) =>
      col
        .defaultTo(sql`uuid_generate_v4()`)
        .notNull()
        .unique()
    )
    .addColumn('description', 'text')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('status', 'varchar', (col) =>
      col
        .references('team_status.name')
        .notNull()
        .onDelete('cascade')
        .onUpdate('cascade')
    )
    .addColumn('meta', 'json', (col) => col.notNull().defaultTo(sql`'{}'`))
    .addColumn('config', 'json', (col) => col.notNull().defaultTo(sql`'{}'`))
    .execute();

  await db
    .withSchema(workspaceSchema)
    .schema.createTable('team_member')
    .addColumn('team_name', 'varchar', (col) =>
      col
        .references('team.name')
        .notNull()
        .onDelete('cascade')
        .onUpdate('cascade')
    )
    .addColumn('member_id', 'uuid', (col) =>
      col
        .references('workspace_member.member_id')
        .notNull()
        .onDelete('cascade')
        .onUpdate('cascade')
    )
    .addColumn('added_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  const TeamStatus = [
    { name: 'active', description: 'Active team' },
    { name: 'inactive', description: 'Inactive team' },
    { name: 'archived', description: 'Archived team' },
  ];

  await db
    .withSchema(workspaceSchema)
    .insertInto('team_status')
    .values(TeamStatus)
    .execute();
}

async function destroyWorkspaceTenant(db: Kysely<any>, workspaceId: string) {
  const workspaceSchema = `workspace_${workspaceId}`;
  await db.transaction().execute(async (trx) => {
    await trx
      .withSchema('public')
      .schema.dropSchema(workspaceSchema)
      .ifExists()
      .cascade()
      .execute();

    console.log(`Dropped schema ${workspaceSchema}`);
    await trx
      .deleteFrom('workspace_member')
      .where('workspace_id', '=', workspaceId)
      .execute();

    console.log(`Deleted workspace members for workspace ${workspaceId}`);

    await trx.deleteFrom('workspace').where('id', '=', workspaceId).execute();

    console.log(`Deleted workspace ${workspaceId}`);
  });
  return workspaceId;
}

export const DatabaseUtils = {
  setupWorkspace: createWorkspaceTenant,
  destroyWorkspace: destroyWorkspaceTenant,
};
