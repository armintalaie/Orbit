import type { JSONColumnType, Generated } from 'kysely';
import type { Timestamp, WorkspaceStatus, MemberStatus, Entity, Permission, Json } from './index.js';

export interface Workspace {
  config: JSONColumnType<any>;
  created_at: Generated<Timestamp>;
  id: Generated<string>;
  name: string;
  status: Generated<WorkspaceStatus>;
  updated_at: Generated<Timestamp>;
}

export interface WorkspaceMember {
  added_at: Generated<Timestamp>;
  status: MemberStatus;
  updated_at: Generated<Timestamp>;
  user_id: string;
  workspace_id: string;
}

export interface WorkspacePermission {
  description: string | null;
  entity: Entity;
  permission: Permission;
}

export interface MainSchema {
  workspace: Workspace;
  workspace_member: WorkspaceMember;
  workspace_permission: WorkspacePermission;
  'auth.users': AuthUsers;
}

export interface AuthUsers {
  aud: string | null;
  banned_until: Timestamp | null;
  confirmation_sent_at: Timestamp | null;
  confirmation_token: string | null;
  confirmed_at: Generated<Timestamp | null>;
  created_at: Timestamp | null;
  deleted_at: Timestamp | null;
  email: string | null;
  email_change: string | null;
  email_change_confirm_status: Generated<number | null>;
  email_change_sent_at: Timestamp | null;
  email_change_token_current: Generated<string | null>;
  email_change_token_new: string | null;
  email_confirmed_at: Timestamp | null;
  encrypted_password: string | null;
  id: string;
  instance_id: string | null;
  invited_at: Timestamp | null;
  is_anonymous: Generated<boolean>;
  /**
   * Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.
   */
  is_sso_user: Generated<boolean>;
  is_super_admin: boolean | null;
  last_sign_in_at: Timestamp | null;
  phone: Generated<string | null>;
  phone_change: Generated<string | null>;
  phone_change_sent_at: Timestamp | null;
  phone_change_token: Generated<string | null>;
  phone_confirmed_at: Timestamp | null;
  raw_app_meta_data: Json | null;
  raw_user_meta_data: Json | null;
  reauthentication_sent_at: Timestamp | null;
  reauthentication_token: Generated<string | null>;
  recovery_sent_at: Timestamp | null;
  recovery_token: string | null;
  role: string | null;
  updated_at: Timestamp | null;
}
