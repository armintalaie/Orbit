import { promises as fs } from 'fs';
import { Kysely, Migrator, PostgresDialect, FileMigrationProvider, CamelCasePlugin } from 'kysely';
import { Pool } from 'pg';
import type { MainSchema } from '../database/schema/public';
import type { WorkspaceSchema } from '../database/schema/workspace';

let db: Kysely<WorkspaceSchema>;

export async function getDb() {
    if (db) {
        return db;
    }
   db = new Kysely<WorkspaceSchema>({
    plugins: [new CamelCasePlugin()],
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DB_CONNECTION,
      }),
    }),
  })
    return db;
    
}

