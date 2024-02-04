import { db } from "../db/handler";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export class QueryEngine {

    public static async getIssues(params: { [key: string]: any } = {}) {  
        let query = db
          .selectFrom('issue')
          .leftJoin('issue_assignee', 'issue.id', 'issue_assignee.issue_id')
          .innerJoin('project', 'issue.projectid', 'project.id')
          .innerJoin('team', 'project.teamid', 'team.id')
          .select(({ eb, fn }) => [
            'issue.id',
            'issue.title',
            'issue.contents',
            'issue.statusid',
            'issue.deadline',
            'issue.datestarted',
            'issue.projectid',
            'project.title as project_title',
            'project.teamid',
            'team.name as team_title',
            jsonArrayFrom(
              eb
                .selectFrom('issue_label')
                .innerJoin('label', 'issue_label.labelid', 'label.id')
                .select(['labelid as id', 'label', 'color'])
                .whereRef('issue_label.issueid', '=', 'issue.id')
            ).as('labels'),
            jsonArrayFrom(
              eb
                .selectFrom('issue_assignee')
                .innerJoin('profiles', 'issue_assignee.user_id', 'profiles.id')
                .selectAll()
                .whereRef('issue_assignee.issue_id', '=', 'issue.id')
            ).as('assignees'),
          ]);

        if (params.assignees && params.assignees.length > 0) {
            query = query.where('issue_assignee.user_id', 'in', params.assignees);

        }

        if (params.teams && params.teams.length > 0) {
            query = query.where('project.teamid', 'in', params.teams.map(Number));
        }

        if (params.statuses && params.statuses.length > 0) {
            query = query.where(
              'issue.statusid',
              'in',
              params.statuses.map(Number)
            );
        }

        const issues = await query.execute();
        return issues;
    }

    public static async getIssue(id: number) {
       let query = db
            .selectFrom('issue')
            .leftJoin('issue_assignee', 'issue.id', 'issue_assignee.issue_id')
            .innerJoin('project', 'issue.projectid', 'project.id')
            .innerJoin('team', 'project.teamid', 'team.id')
            .select(({ eb, fn }) => [
            'issue.id',
            'issue.title',
            'issue.contents',
            'issue.statusid',
            'issue.deadline',
            'issue.datestarted',
            'issue.projectid',
            'project.title as project_title',
            'project.teamid',
            'team.name as team_title',
            jsonArrayFrom(
                eb
                .selectFrom('issue_label')
                .innerJoin('label', 'issue_label.labelid', 'label.id')
                .select(['labelid as id', 'label', 'color'])
                .whereRef('issue_label.issueid', '=', 'issue.id')
            ).as('labels'),
            jsonArrayFrom(
                eb
                .selectFrom('issue_assignee')
                .innerJoin('profiles', 'issue_assignee.user_id', 'profiles.id')
                .selectAll()
                .whereRef('issue_assignee.issue_id', '=', 'issue.id')
            ).as('assignees'),
            ])
            .where('issue.id', '=', id);

        const issue = await query.execute();
        return issue;

    }

    public static async getLabels() {
        const labels = await db
            .selectFrom('label')
            .selectAll()
            .execute();
        return labels;
    }

    public static async getStatuses() {
        const statuses = await db
            .selectFrom('status')
            .selectAll()
            .execute();
        return statuses;
    }

    public static async getProjects(params: { [key: string]: any } = {}) {
        let query = db
    .selectFrom('project')
    // .innerJoin(
    //   db
    //     .selectFrom('team_member')
    //     .select(['teamid'])
    //     // .where('memberid', '=', user.id)
    //     .as('teams'),
    //   'teams.teamid',
    //   'project.teamid'
    // )
    .innerJoin('team', 'project.teamid', 'team.id')
    .select(({ eb, fn }) => [
      'project.id',
      'project.title',
      'project.description',
      'project.statusid',
      'project.deadline',
      'project.title as project_title',
      'project.teamid',
      'team.name as team_title',
    ]);


  if (params.teams && params.teams.length > 0) {
    query = query.where('project.teamid', 'in', params.teams.map(Number));
  }

  const result = await query.execute()
  console.log(result.length)
  return result;
}

public static async getProject(id: number) {
    let query = db
    .selectFrom('project')
    .innerJoin(
      db
        .selectFrom('team_member')
        .select(['teamid'])
        // .where('memberid', '=', user.id)
        .as('teams'),
      'teams.teamid',
      'project.teamid'
    )
    .innerJoin('team', 'project.teamid', 'team.id')
    .select(({ eb, fn }) => [
      'project.id',
      'project.title',
      'project.description',
      'project.statusid',
      'project.deadline',
      'project.title as project_title',
      'project.teamid',
      'team.name as team_title',
    ])
    .where('project.id', '=', id);

  const result = await query.execute()
  return result;

}

public static async getTeams(params: { [key: string]: any } = {}) {
    let query = db
    .selectFrom('team')
    .selectAll();

  if (params.teams && params.teams.length > 0) {
    query = query.where('team.id', 'in', params.teams.map(Number));
  }

  const result = await query.execute()
  return result;
}





}