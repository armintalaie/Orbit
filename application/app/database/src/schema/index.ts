import { Generated } from 'kysely';

interface WorkspaceTable {
  id: Generated<string>;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  config: JSON;
}

interface WorkspaceMemberTable {
  workspaceId: string;
  userId: string;
  addedAt: Generated<Date>;
  updatedAt: Generated<Date>;
  username: string;
}

// Keys of this interface are table names.
export interface PublicDatabase {
  'public.workspace': WorkspaceTable;
  'public.workspaceMember': WorkspaceMemberTable;
}
