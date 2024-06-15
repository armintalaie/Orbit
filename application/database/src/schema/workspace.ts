import { Generated } from 'kysely';
import { PublicDatabase } from './index';

interface IssueTable {
  id: Generated<number>;
  title: string;
  contents: JSON | null;
  statusid: number | null;
  projectid: number | null;
  deadline: Date | null;
  datecreated: Date;
  dateupdated: Date;
  teamid: number;
}
interface IssueAssigneeTable {
  user_id: string;
  issue_id: number;
  dateassigned: Date | null | string;
}

interface LabelTable {
  id: Generated<number>;
  label: string;
  color: string;
  description: string | null;
}

interface IssueLabelTable {
  issueid: number;
  labelid: number;
}

interface StatusTable {
  id: Generated<number>;
  label: string;
}

interface ProjectTable {
  id: Generated<number>;
  title: string;
  description: string | null;
  statusid: number | null;
  deadline: Date | null;
  datecreated: Date;
  dateupdated: Date;
  teamid: number | null;
}

interface Profiles {
  id: Generated<number>;
  full_name: string;
  avatar_url: string | null;
  email: string;
}

interface teamMemberTable {
  teamid: number;
  memberid: string;
  datejoined: Date;
}

interface teamTable {
  id: Generated<number>;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkspaceTable {
  id: Generated<number>;
  name: string;
  created_at: Date;
  updated_at: Date;
  config: JSON;
}

interface WorkspaceMemberTable {
  workspace_id: number;
  profile_id: number;
  added_at: Date;
  updated_at: Date;
  status: string;
}

interface WorkspaceMemberRole {
  member_id: string;
  role: string;
}

interface RoleTable {
  name: string;
  description: string;
}

interface RolePermissionTable {
  role: string;
  permission: string;
}

// Keys of this interface are table names.
export interface Database extends PublicDatabase {
  issue: IssueTable;
  issueAssignee: IssueAssigneeTable;
  label: LabelTable;
  issueLabel: IssueLabelTable;
  status: StatusTable;
  project: ProjectTable;
  profiles: Profiles;
  teamMember: teamMemberTable;
  team: teamTable;
  workspace: WorkspaceTable;
  workspaceMember: WorkspaceMemberTable;
  workspaceMemberRole: WorkspaceMemberRole;
  role: RoleTable;
  rolePermission: RolePermissionTable;
}
