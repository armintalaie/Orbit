import { Kysely, PostgresDialect, CamelCasePlugin } from 'kysely';
import { Pool } from 'pg';
import type { WorkspaceSchema } from '../database/schema/workspace.js';

let db: Kysely<WorkspaceSchema>;

export async function getDb() {
  if (db) {
    return db;
  }
  db = new Kysely<WorkspaceSchema>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DB_CONNECTION,
      }),
    }),
    plugins: [new CamelCasePlugin()],
  });
  return db;
}
