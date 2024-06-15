import { Pool } from 'pg';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
const DB_CONNECTION = process.env.DB_CONNECTION;
const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: DB_CONNECTION,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<any>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
