import type { Transaction } from "kysely";

export async function projectTableSetup(trx: Transaction<any>, workspaceSchema: string) {
    await trx
      .withSchema(workspaceSchema)
      .schema.createTable('project_status')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('name', 'text', (col) => col.notNull().unique())
      .execute();
  
    await trx
      .withSchema(workspaceSchema)
      .insertInto('project_status')
      .values([
        { name: 'backlog' },
        { name: 'planned' },
        { name: 'in progress' },
        { name: 'completed' },
        { name: 'cancelled' },
      ])
      .execute();
  
      await trx
      .withSchema(workspaceSchema)
      .schema.createTable('project')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('name', 'text', (col) => col.notNull().unique())
      .addColumn('description', 'text')
      .addColumn('status', 'text', (col) =>
        col.references('project_status.name').onUpdate('cascade').onDelete('set null')
      )
      .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo('now()'))
      .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo('now()'))
      .addColumn('target_date', 'timestamptz')
      .addColumn('start_date', 'timestamptz')
      .addColumn('meta', 'json', (col) => col.notNull().defaultTo('{}'))
      .execute();
  
      await trx
      .withSchema(workspaceSchema)
      .schema.createTable('project_member')
      .addColumn('user_id', 'uuid', (col) =>
        col.references('member.id').onUpdate('cascade').onDelete('cascade')
      )
      .addColumn('project_id', 'serial', (col) => col.references('project.id').onUpdate('cascade').onDelete('cascade'))
      .addPrimaryKeyConstraint('project_member_pkey', ['user_id', 'project_id'])
      .execute();

  }
  