import { Kysely, sql } from 'kysely';

const PERMISSIONS = ['read', 'write', 'modify', 'admin', 'comment'];
const ENTITY_TYPES = ['project', 'team', 'workspace', 'issue', 'comment'];

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createSchema('public').ifNotExists().execute();

  const groupings = PERMISSIONS.map((permission) => {
    return ENTITY_TYPES.map((entity) => {
      return [permission, entity];
    });
  }).flat();

  await db
    .withSchema('public')
    .insertInto('workspace_permission').values(groupings.map((group) => {
      return {
        permission: group[0],
        entity: group[1],
      }
    })).execute();
}

export async function down(db: Kysely<any>): Promise<void> { 
}
