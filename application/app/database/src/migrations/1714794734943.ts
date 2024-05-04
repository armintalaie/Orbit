import { Kysely, sql } from 'kysely';

// list of all workspace permissions
const PERMISSIONS = [
  'read',
  'write',
  'delete',
  'invite',
  'remove',
  'admin',
  'share',
  'comment',
];

const ENTITY_TYPES = ['project', 'team', 'workspace', 'issue', 'comment'];

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createType('permission').asEnum(PERMISSIONS).execute();
  await db.schema.createType('entity').asEnum(ENTITY_TYPES).execute();

  await db.schema
    .createTable('workspace_permission')
    .addColumn('permission', 'permission' as any, (col) => col.notNull())
    .addColumn('entity', 'entity' as any, (col) => col.notNull())
    .addColumn('description', 'text')
    .addPrimaryKeyConstraint('primary_key', ['permission', 'entity'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropType('workspace_permission').execute();
  await db.schema.dropType('entity').execute();
  await db.schema.dropType('permission').execute();
}
