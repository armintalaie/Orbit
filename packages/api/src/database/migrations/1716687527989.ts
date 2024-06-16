import { Kysely, sql, Transaction } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const compiledQuery = sql`
    CREATE OR REPLACE FUNCTION remove_workspace_member()
RETURNS TRIGGER AS $$
DECLARE
    schema_name TEXT;
    member_id UUID;
BEGIN
    -- Construct the schema name
    schema_name := 'workspace_' || OLD.workspace_id;
    member_id := OLD.user_id;

    -- Execute the drop schema command
    EXECUTE 'DELETE FROM ' || quote_ident(schema_name) || '.member WHERE id = $1' USING member_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- SQL script to create the trigger
CREATE TRIGGER remove_workspace_member_trigger
AFTER DELETE ON workspace_member
FOR EACH ROW
EXECUTE FUNCTION remove_workspace_member();
    `.compile(db);

  await db.executeQuery(compiledQuery);
}

export async function down(db: Kysely<any>): Promise<void> {}
