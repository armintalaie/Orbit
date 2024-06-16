import type { Kysely } from 'kysely';
import type { WorkspaceSchema } from '../../database/schema/workspace.js';
import { getDb } from '../../utils/db.js';
import type { GraphQLFieldResolver } from 'graphql';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { createWorkspaceTenant, destroyWorkspaceTenant } from '../../database/helpers/workspace.js';

const d2 = await getDb();

export const workspaceResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { id } = args;
  return await d2.selectFrom('public.workspace').selectAll().where('id', '=', id).executeTakeFirstOrThrow();
};

export const workspacesResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  return d2.selectFrom('public.workspace').selectAll().execute();
};

export const membersResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  info
) => {
  const workspaceId = parent.id;
  const m = await d2.withSchema(`workspace_${workspaceId}`).selectFrom('member').selectAll().execute();
  return m.map((member) => {
    return {
      ...member,
      profile: {
        ...member,
      },
    };
  });
};

export const memberResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const workspaceId = parent.id;
  // @ts-ignore
  const userId = context.user.id;
  const m = await d2
    .withSchema(`workspace_${workspaceId}`)
    .selectFrom('member')
    .selectAll()
    .where('id', '=', userId)
    .executeTakeFirstOrThrow();
  return {
    ...m,
    profile: {
      ...m,
    },
  };
};

export const userResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { email, id } = args;
  return getUserName({ email, id, db: context.db });
};

export const meResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context: any,
  _
) => {
  return getUserName({ db: d2, id: context.user.id });
};

const getUserName = async ({ id, email, db }: { id?: string; email?: string; db: Kysely<WorkspaceSchema> }) => {
  let query = d2
    .selectFrom('auth.users')
    .select((eb) => [
      'auth.users.email',
      'auth.users.id',
      'auth.users.created_at',
      'auth.users.updated_at',
      jsonArrayFrom(
        eb
          .selectFrom('public.workspace_member')
          .selectAll()
          .whereRef('user_id', '=', 'auth.users.id')
          .orderBy('added_at', 'desc')
          .innerJoin('public.workspace', 'public.workspace.id', 'public.workspace_member.workspace_id')
      ).as('workspaces'),
    ]);
  if (email) {
    query = query.where('email', '=', email);
  } else if (id) {
    query = query.where('auth.users.id', '=', id);
  } else {
    throw new Error('Either email or id is required');
  }
  return query.executeTakeFirstOrThrow();
};

export const workspaceConfigResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { id } = parent;
  const config = await d2
    .withSchema(`workspace_${id}`)
    .selectNoFrom((eb) => [
      jsonArrayFrom(eb.selectFrom('issue_status').selectAll()).as('issueStatus'),
      jsonArrayFrom(eb.selectFrom('project_status').selectAll()).as('projectStatus'),
    ])
    .executeTakeFirstOrThrow();

  return config;
};

export const createWorkspaceResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { workspace } = args;
  const { name } = workspace;
  console.log('Creating workspace with name: ', name);
  // @ts-ignore
  const creatorId = context.user.id as string;
  const workspaceInfo = await createWorkspaceTenant(d2, { name, ownerId: creatorId, config: {} });
  const workspaceId = workspaceInfo.id;
  return workspaceInfo;
};

export const updateWorkspaceResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { id, workspace } = args;
  return d2
    .updateTable('public.workspace')
    .set({ ...workspace })
    .where('id', '=', id)
    .execute();
};

export const deleteWorkspaceResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { id } = args;
  await destroyWorkspaceTenant(d2, id);
};

export const newWorkspaceMemberResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { workspaceId, member } = args;
  return await d2.transaction().execute(async (trx) => {
    const user = await trx.selectFrom('auth.users').select('id').where('email', '=', member.email).executeTakeFirst();
    if (!user) {
      throw new Error('User not found');
    }
    await trx
      .insertInto('public.workspace_member')
      .values({
        user_id: user.id,
        workspace_id: workspaceId,
        status: 'active',
      })
      .execute();

    await trx
      .withSchema(`workspace_${workspaceId}`)
      .insertInto('member')
      .values({
        id: user.id,
        email: member.email,
        username: member.email,
      })
      .execute();

    return {
      id: user.id,
      email: member.email,
      username: member.email,
    };
  });
};

export const removeWorkspaceMemberResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { workspaceId, userId, email } = args;
  let id = userId;
  if (!id) {
    if (!email) {
      throw new Error('Either email or userId is required');
    }
    id = await d2.selectFrom('auth.users').select('id').where('email', '=', email).executeTakeFirstOrThrow();
  }
  const user = await d2
    .deleteFrom('public.workspace_member')
    .where('workspace_id', '=', workspaceId)
    .where('user_id', '=', id)
    .returningAll()
    .execute();
  console.log(user);
  return {
    status: 'success',
    message: 'Member removed',
  };
};

export const updateWorkspaceMemberResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { workspaceId, userId, profile } = args;
  const profileRes = await d2
    .withSchema(`workspace_${workspaceId}`)
    .updateTable('member')
    .set({ ...profile })
    .where('id', '=', userId)
    .returningAll()
    .executeTakeFirstOrThrow();
  return {
    profile: profileRes,
  };
};

export const workspaceResolvers = {
  workspaceResolver,
  workspacesResolver,
  membersResolver,
  userResolver,
  meResolver,
  workspaceConfigResolver,
  createWorkspaceResolver,
  updateWorkspaceResolver,
  deleteWorkspaceResolver,
  newWorkspaceMemberResolver,
  removeWorkspaceMemberResolver,
  memberResolver,
  updateWorkspaceMemberResolver,
};
