import type { Kysely } from "kysely";
import type { WorkspaceSchema } from "../../database/schema/workspace";
import { getDb } from "../../utils/db";
import type { GraphQLFieldResolver } from "graphql";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";

const d2 = await getDb();

export const workspaceResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const { id } = args;
    return await d2.selectFrom('public.workspace').selectAll().where('id', '=', id).executeTakeFirstOrThrow();
}

export const workspacesResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    return d2.selectFrom('public.workspace').selectAll().execute();
}

export const membersResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, info) => {
    const workspaceId  = parent.id;
    const m = await d2.withSchema(`workspace_${workspaceId}`).selectFrom('member').selectAll().execute();
    return m.map((member) => {
        return {
            ...member,
            profile: {
                ...member
            }
        }
    });
}

export const userResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {email, id} = args;
    return getUserName({email, id, db: context.db});
}

export const meResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context: any, _) => {
    return getUserName({db: d2, id: context.user.id});
}


const getUserName = async ({id, email, db}: {id?: string, email?: string, db: Kysely<WorkspaceSchema>}) => {
    let query = d2.selectFrom('auth.users').select((eb) => [
        'auth.users.email',
         'auth.users.id',
         'auth.users.created_at',
         'auth.users.updated_at',
         jsonArrayFrom(
             eb.selectFrom('public.workspace_member').selectAll().whereRef('user_id', '=', 'auth.users.id').orderBy('added_at', 'desc')
             .innerJoin('public.workspace','public.workspace.id', 'public.workspace_member.workspace_id')
         ).as('workspaces')
     ])
     if(email) {
         query = query.where('email', '=', email);
     } else if(id) {
         query = query.where('auth.users.id', '=', id);
     } else {
         throw new Error('Either email or id is required');
     }
     return query.executeTakeFirstOrThrow();
}


export const workspaceConfigResolver: GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {id} = parent;
    const config = await d2.withSchema(`workspace_${id}`).selectNoFrom((eb)=> [
        jsonArrayFrom(eb.selectFrom('issue_status').selectAll()).as('issueStatus'),
        jsonArrayFrom(eb.selectFrom('project_status').selectAll()).as('projectStatus'),
    ]).executeTakeFirstOrThrow();

    return config;
}



export const workspaceResolvers = {
    workspaceResolver,
    workspacesResolver,
    membersResolver,
    userResolver,
    meResolver,
    workspaceConfigResolver
}