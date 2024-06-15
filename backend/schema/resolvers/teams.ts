import type { Kysely } from "kysely";
import type { WorkspaceSchema } from "../../database/schema/workspace";
import { getDb } from "../../utils/db";
import type { GraphQLFieldResolver } from "graphql";
import {jsonArrayFrom, jsonBuildObject} from "kysely/helpers/postgres";

const d2 = await getDb();

export const createTeamResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {workspaceId, team} = args;
    return d2.withSchema(`workspace_${workspaceId}`).insertInto('team').values({...team}).returningAll().executeTakeFirstOrThrow();
}

export const updateTeamResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {workspaceId, id, team} = args;
    return d2.withSchema(`workspace_${workspaceId}`).updateTable('team').set({...team}).where('id', '=', id).returningAll().executeTakeFirstOrThrow();
}

export const deleteTeamResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {workspaceId, id} = args;
    await d2.withSchema(`workspace_${workspaceId}`).deleteFrom('team').where('id', '=', id).returningAll().executeTakeFirstOrThrow();
    return {
        status: 'success',
        message: 'Team deleted'
    }
}

export const teamResolver: GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    try {
        const {workspaceId, id} = args;
        return d2.withSchema(`workspace_${workspaceId}`).selectFrom('team').selectAll(['team']).where('team.id', '=', id)
        .select((eb) => [
            jsonArrayFrom(eb.selectFrom('team_member')
                .leftJoin('member', 'member.id', 'team_member.user_id')
                .selectAll(['team_member'])
                .select((eb) => [
                    "member.id",
                    "member.email",
                    jsonBuildObject({
                            email: eb.ref('member.email'),
                            firstName: eb.ref('member.first_name'),
                            lastName: eb.ref('member.last_name'),
                            avatar: eb.ref('member.avatar'),
                            username: eb.ref('member.username')

                    }).as('profile')
                ])
            ).as('members'),
            jsonArrayFrom(eb.selectFrom('project_team')
                .leftJoin('project', 'project.id', 'project_team.project_id')
                .selectAll(['project_team'])
                .select((eb) => [
                    "project.id",
                    "project.name",
                    "project.description"
                ])
            ).as('projects')
            ]).executeTakeFirstOrThrow();
    } catch(e) {
        console.error(e);
        return {
            message: 'Error getting team',
            status: 'error'
        }
    }
}

export const teamsResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {workspaceId} = args;
    return getTeams({wid: workspaceId, db: d2});
}

export const workspaceTeamsResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const workspaceId = parent.id
    return getTeams({wid: workspaceId, db: d2});

}

async function getTeams({wid, db}: {wid: string, db: Kysely<WorkspaceSchema>}) {
    return db.withSchema(`workspace_${wid}`).selectFrom('team').selectAll().execute();
}

export const teamsResolvers = {
    teamResolver,
    teamsResolver,
    createTeamResolver,
    updateTeamResolver,
    deleteTeamResolver

}