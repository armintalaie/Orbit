import type { Kysely } from "kysely";
import type { WorkspaceSchema } from "../../database/schema/workspace";
import { getDb } from "../../utils/db";
import type { GraphQLFieldResolver } from "graphql";
import { jsonArrayFrom } from "kysely/helpers/postgres";

const d2 = await getDb();

export const issuesResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {workspaceId, projectId} = args
    return getIssues({wid: workspaceId, db: d2, pid: projectId});
}

export const projectIssuesResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, info) => {
    const {wid} = info.variableValues;
    return getIssues({wid: wid as string, db: d2, pid: parent.id});
}


export const getIssues = async ({wid, db, pid}: {wid: string, db: Kysely<WorkspaceSchema>, pid?: string}) => {
    let query = db.withSchema(`workspace_${wid}`).selectFrom('issue').innerJoin('issue_status', 'issue_status.id', 'issue.status_id')
    if(pid) {
        query = query.innerJoin(`project_issue`, `project_issue.issue_id`, `issue.id`).where('project_id', '=', Number(pid))
    }

    const issues = await query.selectAll(['issue']).select(['issue_status.name as status']).select((eb) => [
        jsonArrayFrom(eb.selectFrom('issue_assignee').selectAll().whereRef('issue_id', '=', 'issue.id').innerJoin('member', 'member.id', 'issue_assignee.user_id')).as('assignees'),
    ]).execute();

    for (const issue of issues) {
        (issue.assignees as any) = issue.assignees.map((assignee) => {
            const {id, email, ...rest} = assignee;
            return {
                id,
                email,
                profile: {
                    ...assignee
                }
            }
        })
    }
    return issues;
}



export const issueResolver: GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {workspaceId, id} = args;
    return d2.withSchema(`workspace_${workspaceId}`).selectFrom('issue').leftJoin('issue_status', 'issue_status.id', 'issue.status_id').selectAll().where('issue.id', '=', id).executeTakeFirstOrThrow();
}

export const updateIssueResolver: GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {workspaceId, id, issue} = args;
    return d2.withSchema(`workspace_${workspaceId}`).updateTable('issue').set({...issue}).where('id', '=', id).returningAll().executeTakeFirstOrThrow();
}

export const createIssueResolver: GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {workspaceId, issue} = args;
    const { issueInput, assignees, projects} = issue;
    return d2.withSchema(`workspace_${workspaceId}`).insertInto('issue').values({...issue}).returningAll().executeTakeFirstOrThrow();
}

/**
 * Deletes an issue present in the workspace. No action is taken if the issue is not found
 */
export const deleteIssueResolver: GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    try {
    const {workspaceId, id} = args;
    await d2.withSchema(`workspace_${workspaceId}`).deleteFrom('issue').where('id', '=', id).returningAll().executeTakeFirstOrThrow();
    return {
        message: 'Issue deleted successfully',
        status: 'success'
    }
    } catch(e) {
        return {
            message: 'Error deleting issue',
            status: 'error'
        }
    }
}


export const issueResolvers = {
   issueResolver,
    issuesResolver,
    updateIssueResolver,
    createIssueResolver,
    deleteIssueResolver,
    projectIssuesResolver

}
