import { Kysely, Transaction } from 'kysely';


export async function up(db: Kysely<any>): Promise<void> {
    const workspaces = await db.withSchema('public').selectFrom('workspace').selectAll().execute();
    for (const workspace of workspaces) {
      await createIssueTables(db as Transaction<any>, `workspace_${workspace.id}`);
    }
}

export async function down(db: Kysely<any>): Promise<void> { 
  const workspaces = await db.withSchema('public').selectFrom('workspace').selectAll().execute();
    for (const workspace of workspaces) {
      await dropIssueTables(db as Transaction<any>, `workspace_${workspace.id}`);
    }
}


export async function createIssueTables(trx: Transaction<any>, workspaceSchema: string) {
  await trx.withSchema(workspaceSchema).schema.createTable('issue_status')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull().unique())
    .addColumn('description', 'text')
    .execute();

   const DEFAULT_ISSUE_STATUSES = [
    { name: 'Backlog', description: 'Task is in the backlog'},
    { name: 'To Do', description: 'Task is yet to be started' },
    { name: 'In Progress', description: 'Task is in progress' },
    { name: 'In Review', description: 'Task is in review'},
    { name: 'Done', description: 'Task is completed' },
    { name: 'Cancelled', description: 'Task is cancelled' }
  ];

  await trx.withSchema(workspaceSchema).insertInto('issue_status')
  .values(DEFAULT_ISSUE_STATUSES).execute();

  await trx.withSchema(workspaceSchema).schema.createTable('issue')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo('now()').notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo('now()').notNull())
    .addColumn('status_id', 'integer', (col) => col.references(`${workspaceSchema}.issue_status.id`).notNull().onUpdate('cascade').onDelete('cascade'))
    .addColumn('target_date', 'timestamptz')
    .addColumn('metadata', 'jsonb', (col) => col.notNull().defaultTo('{}'))
    .execute();

  await trx.withSchema(workspaceSchema).schema.createTable('issue_assignee')
    .addColumn('issue_id', 'serial', (col) => col.references(`${workspaceSchema}.issue.id`).notNull().onUpdate('cascade').onDelete('cascade'))
    .addColumn('user_id', 'uuid', (col) => col.references('member.id').notNull().onUpdate('cascade').onDelete('cascade'))
    .addPrimaryKeyConstraint('issue_assignee_pkey', ['issue_id', 'user_id'])
    .execute();

  await trx.withSchema(workspaceSchema).schema.createTable('project_issue')
    .addColumn('project_id', 'serial', (col) => col.references('project.id').notNull().onUpdate('cascade').onDelete('cascade'))
    .addColumn('issue_id', 'serial', (col) => col.references(`${workspaceSchema}.issue.id`).notNull().onUpdate('cascade').onDelete('cascade'))
    .addPrimaryKeyConstraint('project_issue_pkey', ['project_id', 'issue_id'])
    .execute();
}


async function dropIssueTables(trx: Kysely<any>, workspaceSchema: string) {
  await trx.withSchema(workspaceSchema).schema.dropTable('project_issue').execute();
  await trx.withSchema(workspaceSchema).schema.dropTable('issue_assignee').execute();
  await trx.withSchema(workspaceSchema).schema.dropTable('issue').execute();
  await trx.withSchema(workspaceSchema).schema.dropTable('issue_status').execute();
}