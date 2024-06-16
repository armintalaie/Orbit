import { Kysely, sql, Transaction } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const compiledQuery = sql`
    CREATE OR REPLACE FUNCTION drop_workspace_schema()
RETURNS TRIGGER AS $$
DECLARE
    schema_name TEXT;
BEGIN
    -- Construct the schema name
    schema_name := 'workspace_' || OLD.id;

    -- Execute the drop schema command
    EXECUTE 'DROP SCHEMA IF EXISTS ' || quote_ident(schema_name) || ' CASCADE';

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- SQL script to create the trigger
CREATE TRIGGER drop_schema_after_delete
AFTER DELETE ON workspace
FOR EACH ROW
EXECUTE FUNCTION drop_workspace_schema();
    `.compile(db);

  await db.executeQuery(compiledQuery);
}

export async function down(db: Kysely<any>): Promise<void> {}
