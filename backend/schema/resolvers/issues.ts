import type { Kysely } from "kysely";
import type { WorkspaceSchema } from "../../database/schema/workspace";
import { getDb } from "../../utils/db";
import type { GraphQLFieldResolver } from "graphql";
import { jsonArrayFrom, jsonBuildObject, jsonObjectFrom } from "kysely/helpers/postgres";

const d2 = await getDb();

export const issuesResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {workspaceId, projectId, teamId} = args
    return getIssues({wid: workspaceId, db: d2, pid: projectId, tid: teamId});
}

export const projectIssuesResolver : GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, info) => {
    const {wid} = info.variableValues;
    return getIssues({wid: wid as string, db: d2, pid: parent.id});
}


export const getIssues = async ({wid, db, pid, tid}: {wid: string, db: Kysely<WorkspaceSchema>, pid?: string, tid?: string}) => {
    let query = db.withSchema(`workspace_${wid}`).selectFrom('issue').innerJoin('issue_status', 'issue_status.id', 'issue.status_id')
    // let projects = pid? [pid]: [null];

    if(tid) {
        query = query.where('teamId', '=', tid);
    }

    // if(projects.length > 0) {
    //     query = query.innerJoin(`project_issue`, `project_issue.issue_id`, `issue.id`).where('project_id', 'in', projects.map((p) => Number(p)));
    // }

    const issues = await query.selectAll(['issue'])
    .select((eb) => [
        jsonBuildObject({
            id: eb.ref('issue_status.id'),
            name: eb.ref('issue_status.name'),
        }).as('status'),
    ]).select((eb) => [
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


function getIssue({wid, db, id}: {wid: string, db: Kysely<WorkspaceSchema>, id: number}): any {
    return db.withSchema(`workspace_${wid}`).selectFrom('issue').leftJoin('issue_status', 'issue_status.id', 'issue.status_id').selectAll(["issue"]).where('issue.id', '=', id).select((eb) => [
        jsonBuildObject({
            id: eb.ref('issue_status.id'),
            name: eb.ref('issue_status.name'),
        }).as('status'),
    ]).select((eb) => [
        jsonArrayFrom(eb.selectFrom('issue_assignee').selectAll().whereRef('issue_id', '=', 'issue.id').innerJoin('member', 'member.id', 'issue_assignee.user_id')).as('assignees'),
        jsonArrayFrom(eb.selectFrom('project_issue').selectAll().whereRef('issue_id', '=', 'issue.id').innerJoin('project', 'project.id', 'project_issue.project_id')).as('projects')
    ]).executeTakeFirstOrThrow();
}

export const issueResolver: GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {workspaceId, id} = args;
    return getIssue({wid: workspaceId, db: d2, id});
}


export const updateIssueResolver: GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {workspaceId, id, issue} = args;
    const { assignees, projects, ...issueInput} = issue;
    if ( issueInput['targetDate'] !== undefined) {
        issueInput['targetDate'] = issueInput['targetDate'] == null? null: new Date(Number(issueInput['targetDate'])).toISOString();
    }

    return await d2.withSchema(`workspace_${workspaceId}`).transaction().execute(async (trx) => {
        await trx.updateTable('issue').set({...issueInput}).where('id', '=', id).returningAll().executeTakeFirstOrThrow();
        if (assignees ) {
            await trx.deleteFrom('issue_assignee').where('issue_id', '=', id).execute();
         if (assignees.length > 0) {
        await trx.insertInto('issue_assignee').values(assignees.map((assignee: any) => ({issue_id: id, user_id: assignee.id}))).execute();
         }
        }
        if (projects ) {
            if (projects) {
                await trx.deleteFrom('project_issue').where('issue_id', '=', id).execute();

            }

            if (projects.length > 0) {

        await trx.insertInto('project_issue').values(projects.map((project: any) => ({issue_id: id, project_id: project.id}))).execute();
            }
        }
        return await getIssue({wid: workspaceId, db: trx, id});
    });

}

export const createIssueResolver: GraphQLFieldResolver<any,{db: Kysely<WorkspaceSchema>}> = async (parent: any, args: any, context, _) => {
    const {workspaceId, issue} = args;
    const { assignees, projects, startDate, ...issueInput} = issue;
    console.log(issueInput, assignees, projects, startDate)
    try {
    return  d2.withSchema(`workspace_${workspaceId}`).transaction().execute(async (trx) => {
        const newIssue = await trx.insertInto('issue').values({...issueInput}).returningAll().executeTakeFirstOrThrow();
        if (assignees && assignees.length > 0) {
        await trx.insertInto('issue_assignee').values(assignees.map((assignee: any) => ({issue_id: newIssue.id, user_id: assignee.id}))).execute();
        }
        if (projects && projects.length > 0) {
        await trx.insertInto('project_issue').values(projects.map((project: any) => ({issue_id: newIssue.id, project_id: project}))).execute();
        }
        return await getIssue({wid: workspaceId, db: trx, id: newIssue.id});

    });
} catch(e) {
    console.error(e);
    return {
        message: 'Error creating issue',
        status: 'error'
    }
}
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
