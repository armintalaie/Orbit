import { issueResolvers } from './issues.js';
import { projectResolvers } from './projects.js';
import { workspaceResolvers } from './workspaces.js';
import { teamsResolvers } from './teams.js';

export const Resolvers = {
  ...issueResolvers,
  ...projectResolvers,
  ...workspaceResolvers,
  ...teamsResolvers,
};
