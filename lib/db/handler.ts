import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5434;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
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

interface IssueTable {
  id: Generated<number>;
  title: string;
  contents: JSON | null;
  statusid: number | null;
  projectid: number | null;
  deadline: Date | null;
  datestarted: Date | null;
  datecreated: Date;
  dateupdated: Date;
}

interface IssueAssigneeTable {
  user_id: string;
  issue_id: number;
  dateassigned: Date | null;
}

interface ProjectTable {
  id: Generated<number>;
  title: string;
  description: string | null;
  statusid: number | null;
  deadline: Date | null;
  datecreated: Date;
  dateupdated: Date;
  datestarted: Date;
  teamid: number | null;
}

// Keys of this interface are table names.
interface Database {
  issue: IssueTable;
  issue_assignee: IssueAssigneeTable;
  project: ProjectTable;
}
