import { issueResolvers } from "./issues";
import { projectResolvers } from "./projects";
import { workspaceResolvers } from "./workspaces";
import {teamsResolvers} from "./teams.ts";




export const Resolvers = {
    ...issueResolvers,
    ...projectResolvers,
    ...workspaceResolvers,
    ...teamsResolvers

}