import { StandardGraphqlTypes } from './standards.js';
import { IssueGraphQLTypes } from './issues.js';
import { ProjectGraphqlTypes } from './projects.js';
import { WorkspaceGraphqlTypes } from './workspaces.js';
import { TeamGraphQLTypes } from './teams.js';

export const SchemaGraphQLTypes = {
  ...IssueGraphQLTypes,
  ...ProjectGraphqlTypes,
  ...WorkspaceGraphqlTypes,
  ...StandardGraphqlTypes,
  ...TeamGraphQLTypes,
};
