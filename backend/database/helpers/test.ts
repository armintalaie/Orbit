
import { promises as fs } from 'fs';
import { Kysely, Migrator, PostgresDialect, FileMigrationProvider, CamelCasePlugin } from 'kysely';
import { Pool } from 'pg';
import { createWorkspaceTenant } from './workspace';

async function test() {
  console.log('migrating to latest');
  const db = new Kysely<any>({
    plugins: [new CamelCasePlugin()],
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DB_CONNECTION,
      }),
    }),
  });

  await createWorkspaceTenant(db, {
    name: 'tessssefgsssssssst',
    ownerId: 'b43dfc5c-a5cf-4ec0-8a5a-911a3f78e38e',
    config: {},
  });
}


await test();