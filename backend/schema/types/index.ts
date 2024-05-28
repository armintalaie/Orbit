import { StandardGraphqlTypes } from "./standards";
import { IssueGraphQLTypes } from "./issues";
import { ProjectGraphqlTypes } from "./projects";
import { WorkspaceGraphqlTypes } from "./workspaces";

export const SchemaGraphQLTypes = {
    ...IssueGraphQLTypes,
    ...ProjectGraphqlTypes,
    ...WorkspaceGraphqlTypes,
    ...StandardGraphqlTypes
}