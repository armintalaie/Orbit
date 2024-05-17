export type WorkspaceMember = {
  memberId: string;
  addedAt: Date;
  updatedAt: Date;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  pronouns: string;
  location: string;
  avatar: string;
  notes: string;
  timezone: string;
  status: string;
};

export type Permission = {
  permission: string;
  entity: string;
};

export type Role = {
  name: string;
  permissions: Permission[];
};

export type WorkspaceMemberStatus = 'active' | 'ignored' | 'pending';

export type UserWorkspace = {
  workspaceId: string;
  name: string;
  updatedAt: Date;
  status: WorkspaceMemberStatus;
};

export type UserInfoType = {
  id: string;
  email: string;
  workspaces: UserWorkspace[];
};

export type ProjectStatus = {
  id: string;
  name: string;
  color: string;
};
