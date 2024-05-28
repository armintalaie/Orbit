import { issueResolvers } from "./issues";
import { projectResolvers } from "./projects";
import { workspaceResolvers } from "./workspaces";




export const Resolvers = {
    ...issueResolvers,
    ...projectResolvers,
    ...workspaceResolvers,

}