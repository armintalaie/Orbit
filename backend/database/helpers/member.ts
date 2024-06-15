import type { Transaction } from "kysely";

const defaultAvatar =
'https://vzbnqbrfobqivmismxxj.supabase.co/storage/v1/object/public/profile_photos/default/av5.png';

export async function memberTableSetup(trx: Transaction<any>, workspaceSchema: string) {
    await trx
        .withSchema(workspaceSchema)
        .schema.createTable('member')
        .addColumn('first_name', 'text')
        .addColumn('last_name', 'text')
        .addColumn('email', 'text', (col) => col.notNull().unique().references('auth.users.email').onUpdate('cascade').onDelete('cascade').primaryKey())
        .addColumn('username', 'text', (col) => col.notNull().unique())
        .addColumn('password', 'text')
        .addColumn('avatar', 'text', (col) => col.notNull().defaultTo(defaultAvatar))
        .addColumn('pronouns', 'text')
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo('now()'))
        .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo('now()'))
        .addColumn('location', 'text')
        .addColumn('id', 'uuid', (col) => col.notNull().unique().references('auth.users.id').onUpdate('cascade').onDelete('cascade'))
        .execute();

    await trx
        .withSchema(workspaceSchema)
        .schema.createTable('member_role')
        .addColumn('user_id', 'uuid', (col) =>
          col.references('member.id').notNull().onDelete('cascade').onUpdate('cascade')
        )
        .addColumn('role_id', 'serial', (col) =>
          col.references('role.id').notNull().onDelete('cascade').onUpdate('cascade')
        )
        .addPrimaryKeyConstraint('primary_key', ['user_id', 'role_id'])
        .execute();
}


async function setupWorkspacePermissionsAndRoles(trx: Transaction<any>, workspaceSchema: string) {
    await trx
      .withSchema(workspaceSchema)
      .schema.createTable('role')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('name', 'varchar', (col) => col.unique().notNull())
      .addColumn('description', 'text')
      .execute();
  
    await trx
      .withSchema(workspaceSchema)
      .schema.createTable('role_permission')
      .addColumn('role_id', 'serial', (col) =>
        col.references('role.id').notNull().onDelete('cascade').onUpdate('cascade')
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

      await createStarterRoles(trx, workspaceSchema);
   
  }

  async function createStarterRoles(trx: Transaction<any>, workspaceSchema: string) {
    const starterRoles = [
      {
        name: 'owner',
        description: 'Owner of the workspace',
      },
      {
        name: 'admin',
        description: 'Admin of the workspace',
      },
      {
        name: 'member',
        description: 'Member of the workspace',
      },
    ];
  
    const roleIds = await trx.withSchema(workspaceSchema).insertInto('role').values(starterRoles).returning(['id', 'name']).execute();

    const permissions = {
        owner: ['admin', 'workspace'],
        admin: ['admin', 'workspace'],
        member: ['read', 'workspace'],
    }

    const rolePermissionValues = roleIds.map((role: any) => {
        const roleName = role.name as 'owner' | 'admin' | 'member';
        return {
            role_id: role.id,
            permission: permissions[roleName][0],
            entity: permissions[roleName][1],
        }
    });
  
    await trx
      .withSchema(workspaceSchema)
      .insertInto('role_permission')
      .values(rolePermissionValues)
      .execute();
  }


  export const setupWorkspaceMembersAndRoles = async (trx: Transaction<any>, workspaceSchema: string) => {
    await setupWorkspacePermissionsAndRoles(trx, workspaceSchema);
    await memberTableSetup(trx, workspaceSchema);
  }