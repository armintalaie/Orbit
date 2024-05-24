import type { Kysely } from "kysely";
import type { WorkspaceSchema } from "../database/schema/workspace";
import { getDb } from "../utils/db";
import type { GraphQLFieldResolver } from "graphql";
import { jsonArrayFrom } from "kysely/helpers/postgres";

const d2 = await getDb();

export const workspaceResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const { workspaceId } = args;
    return await d2.selectFrom('public.workspace').selectAll().where('id', '=', workspaceId).executeTakeFirstOrThrow();
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