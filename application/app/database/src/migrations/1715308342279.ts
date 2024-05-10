import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db
    .insertInto('workspace_permission')
    .values([
      { permission: 'read', entity: 'project', description: 'Read project' },
      { permission: 'write', entity: 'project', description: 'Write project' },
      {
        permission: 'delete',
        entity: 'project',
        description: 'Delete project',
      },
      {
        permission: 'invite',
        entity: 'project',
        description: 'Invite to project',
      },
      {
        permission: 'remove',
        entity: 'project',
        description: 'Remove from project',
      },
      { permission: 'admin', entity: 'project', description: 'Admin project' },
      { permission: 'share', entity: 'project', description: 'Share project' },
      {
        permission: 'comment',
        entity: 'project',
        description: 'Comment on project',
      },

      { permission: 'read', entity: 'team', description: 'Read team' },
      { permission: 'write', entity: 'team', description: 'Write team' },
      { permission: 'delete', entity: 'team', description: 'Delete team' },
      { permission: 'invite', entity: 'team', description: 'Invite to team' },
      { permission: 'remove', entity: 'team', description: 'Remove from team' },
      { permission: 'admin', entity: 'team', description: 'Admin team' },
      { permission: 'share', entity: 'team', description: 'Share team' },
      { permission: 'comment', entity: 'team', description: 'Comment on team' },

      {
        permission: 'read',
        entity: 'workspace',
        description: 'Read workspace',
      },
      {
        permission: 'write',
        entity: 'workspace',
        description: 'Write workspace',
      },
      {
        permission: 'delete',
        entity: 'workspace',
        description: 'Delete workspace',
      },
      {
        permission: 'invite',
        entity: 'workspace',
        description: 'Invite to workspace',
      },
      {
        permission: 'remove',
        entity: 'workspace',
        description: 'Remove from workspace',
      },
      {
        permission: 'admin',
        entity: 'workspace',
        description: 'Admin workspace',
      },
      {
        permission: 'share',
        entity: 'workspace',
        description: 'Share workspace',
      },
      {
        permission: 'comment',
        entity: 'workspace',
        description: 'Comment on workspace',
      },

      { permission: 'read', entity: 'issue', description: 'Read issue' },
      { permission: 'write', entity: 'issue', description: 'Write issue' },
      { permission: 'delete', entity: 'issue', description: 'Delete issue' },
      { permission: 'invite', entity: 'issue', description: 'Invite to issue' },
      {
        permission: 'remove',
        entity: 'issue',
        description: 'Remove from issue',
      },
      { permission: 'admin', entity: 'issue', description: 'Admin issue' },
      { permission: 'share', entity: 'issue', description: 'Share issue' },
      {
        permission: 'comment',
        entity: 'issue',
        description: 'Comment on issue',
      },

      { permission: 'read', entity: 'comment', description: 'Read comment' },
      { permission: 'write', entity: 'comment', description: 'Write comment' },
      {
        permission: 'delete',
        entity: 'comment',
        description: 'Delete comment',
      },
      {
        permission: 'invite',
        entity: 'comment',
        description: 'Invite to comment',
      },
      {
        permission: 'remove',
        entity: 'comment',
        description: 'Remove from comment',
      },
      { permission: 'admin', entity: 'comment', description: 'Admin comment' },
      { permission: 'share', entity: 'comment', description: 'Share comment' },
      {
        permission: 'comment',
        entity: 'comment',
        description: 'Comment on comment',
      },
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom('workspace_permission').where('1', '=', '1').execute();
}
