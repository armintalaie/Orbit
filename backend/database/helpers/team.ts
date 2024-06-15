import type { Transaction } from "kysely";

export async function teamTableSetup(trx: Transaction<any>, workspaceSchema: string) {
    await trx
      .withSchema(workspaceSchema)
      .schema.createTable('team')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('name', 'text', (col) => col.notNull().unique())
      .addColumn('identifier', 'text', (col) => col.notNull().unique())
      .addColumn('description', 'text')
      .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo('now()'))
      .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo('now()'))
      .addColumn('config', 'json', (col) => col.notNull().defaultTo('{}'))
      .execute();
  
    await trx
      .withSchema(workspaceSchema)
      .schema.createTable('team_member')
      .addColumn('user_id', 'uuid', (col) =>
        col.references('member.id').onUpdate('cascade').onDelete('cascade')
      )
      .addColumn('team_id', 'serial', (col) => col.references('team.id').onUpdate('cascade').onDelete('cascade'))
      .addPrimaryKeyConstraint('team_member_pkey', ['user_id', 'team_id'])
      .execute();

     await trx
      .withSchema(workspaceSchema)
      .schema.createTable('project_team')
        .addColumn('project_id', 'serial', (col) => col.references('project.id').onUpdate('cascade').onDelete('cascade'))
        .addColumn('team_id', 'serial', (col) => col.references('team.id').onUpdate('cascade').onDelete('cascade'))
        .addPrimaryKeyConstraint('project_team_pkey', ['project_id', 'team_id'])
        .execute();
  
  }
