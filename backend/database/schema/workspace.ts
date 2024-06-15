import type { JSONColumnType, Generated } from "kysely";
import type { Timestamp, WorkspaceStatus, MemberStatus, Entity, Permission, Json } from ".";
import type { AuthUsers, Workspace, WorkspaceMember } from "./public";


export interface Member {
  avatar: Generated<string>;
  created_at: Generated<Timestamp>;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  location: string | null;
  password: string | null;
  pronouns: string | null;
  updated_at: Generated<Timestamp>;
  username: string;
}

export interface MemberRole {
  role_id: Generated<number>;
  user_id: string;
}

export interface Project {
  createdAt: Generated<Timestamp>;
  description: string | null;
  id: Generated<number>;
  meta: Generated<Json>;
  name: string;
  startDate: Timestamp | null;
  status: string | null;
  targetDate: Timestamp | null;
  updatedAt: Generated<Timestamp>;
}

export interface ProjectMember {
  project_id: Generated<number>;
  user_id: string;
}

export interface ProjectStatus {
  id: Generated<number>;
  name: string;
}

export interface ProjectTeam {
  project_id: Generated<number>;
  team_id: Generated<number>;
}

export interface Role {
  description: string | null;
  id: Generated<number>;
  name: string;
}

export interface RolePermission {
  entity: Entity;
  permission: Permission;
  role_id: Generated<number>;
}

export interface Team {
  config: Generated<Json>;
  created_at: Generated<Timestamp>;
  description: string | null;
  id: Generated<number>;
  identifier: string;
  name: string;
  updated_at: Generated<Timestamp>;
}

export interface TeamMember {
  team_id: Generated<number>;
  user_id: string;
}

export interface Issue {
  id: number;
  title: string;
  content: string;
  status_id: number;
  targetDate?: string;
  startDate?: string;
  datecreated: string;
  dateupdated: string;
  teamId: number | string;
  assignees: Member[];
  metadata: Json;
}

export interface IssueStatus {
  id: number;
  name: string;
  description: string;
}

export interface IssueAssignee {
  issue_id: number;
  user_id: string;
}

export interface ProjectIssue {
  project_id: number;
  issue_id: number;
}



export interface WorkspaceSchema {
  issue: Issue;
  issue_status: IssueStatus;
  issue_assignee: IssueAssignee;
  member: Member;
  member_role: MemberRole;
  project: Project;
  project_issue: ProjectIssue;
  project_member: ProjectMember;
  project_status: ProjectStatus;
  project_team: ProjectTeam;
  role: Role;
  role_permission: RolePermission;
  team: Team;
  team_member: TeamMember;
  'public.workspace': Workspace;
  'public.workspace_member': WorkspaceMember;
  'auth.users': AuthUsers;
}