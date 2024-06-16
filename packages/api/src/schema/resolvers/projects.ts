import type { Kysely } from 'kysely';
import type { WorkspaceSchema } from '../../database/schema/workspace.js';
import { getDb } from '../../utils/db.js';
import type { GraphQLFieldResolver } from 'graphql';
import { jsonBuildObject } from 'kysely/helpers/postgres';

const d2 = await getDb();

export const createProjectResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { workspaceId, project } = args;
  return d2
    .withSchema(`workspace_${workspaceId}`)
    .insertInto('project')
    .values({ ...project })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const updateProjectResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { workspaceId, id, project } = args;
  return d2
    .withSchema(`workspace_${workspaceId}`)
    .updateTable('project')
    .set({ ...project })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const deleteProjectResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { workspaceId, id } = args;
  return d2
    .withSchema(`workspace_${workspaceId}`)
    .deleteFrom('project')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const projectResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  try {
    const { workspaceId, id } = args;
    return d2
      .withSchema(`workspace_${workspaceId}`)
      .selectFrom('project')
      .selectAll(['project'])
      .where('project.id', '=', id)
      .leftJoin('project_status', 'project_status.name', 'project.status')
      .select((eb) => [
        jsonBuildObject({
          id: eb.ref('project_status.id'),
          name: eb.ref('project_status.name'),
        }).as('status'),
      ])
      .executeTakeFirstOrThrow();
  } catch (e) {
    console.error(e);
    return {
      message: 'Error deleting project',
      status: 'error',
    };
  }
};

export const projectsResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const { workspaceId } = args;
  return getProjects({ wid: workspaceId, db: d2 });
};

export const workspaceProjectsResolver: GraphQLFieldResolver<any, { db: Kysely<WorkspaceSchema> }> = async (
  parent: any,
  args: any,
  context,
  _
) => {
  const workspaceId = parent.id;
  return getProjects({ wid: workspaceId, db: d2 });
};

const getProjects = async ({ wid, db }: { wid: string; db: Kysely<WorkspaceSchema> }) => {
  return db.withSchema(`workspace_${wid}`).selectFrom('project').selectAll().execute();
};

export const projectResolvers = {
  workspaceProjectsResolver,
  projectsResolver,
  projectResolver,
  createProjectResolver,
  updateProjectResolver,
  deleteProjectResolver,
};
