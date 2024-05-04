import { Kysely, sql } from 'kysely';

type WorkspaceCreateInput = {
  name: string;
  ownerId: string;
  config: Record<string, any>;
};

async function createWorkspaceTenant(
  db: Kysely<any>,
  input: WorkspaceCreateInput
) {
  let workspace = await db
    .withSchema('public')
    .insertInto('workspace')
    .values({
      name: input.name,
      config: input.config,
    })
    .returning('id')
    .executeTakeFirstOrThrow();

  console.log('LOG: Workspace created', workspace);

  await db
    .withSchema('public')
    .insertInto('workspace_member')
    .values({
      workspace_id: workspace.id,
      user_id: input.ownerId,
      username: input.ownerId,
    })
    .execute();

  console.log('LOG: Workspace member added', workspace);

  await setupWorkspaceTables(db, workspace.id);

  console.log('LOG: Workspace tables setup', workspace);

  return workspace;
}

async function setupWorkspaceTables(db: Kysely<any>, workspaceId: string) {
  const workspaceSchema = `workspace_${workspaceId}`;
  await db.schema.createSchema(workspaceSchema).ifNotExists().execute();
  await setupWorkspacePermissionsAndRoles(db, workspaceSchema);
  await setupWorkspaceTeamTable(db, workspaceSchema);
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
    .addColumn('profile', 'json', (col) => col.notNull())
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
  await db
    .withSchema('public')
    .schema.dropSchema(workspaceSchema)
    .ifExists()
    .cascade()
    .execute();

  console.log(`Dropped schema ${workspaceSchema}`);
  await db
    .deleteFrom('workspace_member')
    .where('workspace_id', '=', workspaceId)
    .execute();

  console.log(`Deleted workspace members for workspace ${workspaceId}`);

  await db.deleteFrom('workspace').where('id', '=', workspaceId).execute();

  console.log(`Deleted workspace ${workspaceId}`);
  return workspaceId;
}

export const DatabaseUtils = {
  setupWorkspace: createWorkspaceTenant,
  destroyWorkspace: destroyWorkspaceTenant,
};
