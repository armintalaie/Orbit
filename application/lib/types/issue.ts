export interface IIssue {
  id: number;
  title: string;
  content: string;
  status: IStatus;
  deadline: string;
  startDate: string;
  targetDate: string;
  dateCreated: string;
  dateUpdated: string;
  assignees: IProfile[];
}

export interface ILabel {
  id: number;
  label: string;
  color: string;
}

export interface IStatus {
  id: number;
  label: string;
}

export interface IProject {
  id: number;
  title: string;
  teamid: number;
  team_title: string;
  description: string;
  statusid: number;
  datecreated: string;
  dateupdated: string;
  deadline: string;
}

export interface IProfile {
  id: string;
  username: string;
  avatar_url: string;
  email: string;
  full_name: string;
  teamid: number;
  team_title: string;
}

export interface IIssueStatus {
  id: string | number;
  name: string;
  color?: string;
  description?: string;
}
