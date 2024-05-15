import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const workspaceIds = await db
    .withSchema('public')
    .selectFrom('workspace')
    .select('id')
    .execute();

  for (const workspaceId of workspaceIds) {
    await updateWorkspacemembers(db, workspaceId.id);
  }
}

export async function down(db: Kysely<any>): Promise<void> {}

function updateWorkspacemembers(db: Kysely<any>, workspaceId: string) {
  const defaultAvatar =
    'https://vzbnqbrfobqivmismxxj.supabase.co/storage/v1/object/public/profile_photos/default/av5.png';

  return db
    .withSchema(`workspace_${workspaceId}`)
    .schema.alterTable('workspace_member')
    .dropColumn('profile')
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
}
