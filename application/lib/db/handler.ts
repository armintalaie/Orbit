import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { Database } from './dbTypes';
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
export const db = new Kysely<Database>({
  dialect,
});
