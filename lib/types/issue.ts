export interface IIssue {
  id: number;
  title: string;
  contents: string;
  statusid: number;
  deadline: string;
  datestarted: string;
  projectid: number;
  project_title: string;
  datecreated: string;
  dateupdated: string;
  teamid: number;
  team_title: string;
  labels: ILabel[];
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
  datestarted: string;
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

export interface ITeam {
  id: number;
  name: string;
  description: string;
  datecreated: string;
  dateupdated: string;
}
