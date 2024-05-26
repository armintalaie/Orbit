import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull } from "graphql";
import * as types from './typeDefs';
import { createProjectResolver, deleteProjectResolver, meResolver, projectResolver, projectsResolver, updateProjectResolver, userResolver, workspaceResolver, workspacesResolver} from "./resolvers";

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            hello: {
                description: 'A simple hello world',
                type: GraphQLString,
                resolve: () => 'Hello World from Orbit!',
            },
            workspaces: {
                description: 'List of workspaces',
                type: new GraphQLList(types.workspaceType),
                resolve: workspacesResolver,
            },
            workspace: {
                description: 'workspaces',
                type: types.workspaceType,
                resolve: workspaceResolver,
                args: {
                    id: { type: GraphQLString }
                }
            },
            user: {
                description: 'A user in Orbit',
                type: types.userType,
                resolve: userResolver,
                args: {
                    email: { type: GraphQLString },
                    id: { type: GraphQLString }
                }
            },
            me: {
                description: 'The current user',
                type: types.userType,
                resolve: meResolver,
            },
            projects: {
                description: 'List of projects',
                type: new GraphQLList(types.projectType),
                resolve: projectsResolver,
                args: {
                    workspaceId: { type: GraphQLString }
                }
            },
            project: {
                description: 'A project',
                type: types.projectType,
                resolve: projectResolver,
                args: {
                    id: { type: GraphQLString },
                    workspaceId: { type: GraphQLString }
                }
            }  
        },
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            hello: {
                description: 'A simple hello world',
                type: GraphQLString,
                resolve: () => 'Hello World from Orbit!',
            },
            createProject: {
                description: 'Create a project',
                type: types.projectType,
                resolve: createProjectResolver,
                args: {
                    workspaceId: { type: new GraphQLNonNull(GraphQLString) },
                    project: { type: new GraphQLNonNull(types.newProjectInputType)}
                }
            },
            updateProject: {
                description: 'Update a project',
                type: types.projectType,
                resolve: updateProjectResolver,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    workspaceId: { type: new GraphQLNonNull(GraphQLString) },
                    project: { type: new GraphQLNonNull(types.updateProjectInputType) }
                }
            },
            deleteProject: {
                description: 'Delete a project',
                type: types.projectType,
                resolve: deleteProjectResolver,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    workspaceId: { type: new GraphQLNonNull(GraphQLString) },
                }
            },
        },
    }),
    types: [
        types.MemberStatus, 
        types.WorkspaceStatus, 
        types.workspaceType, 
        types.memberType, 
        types.profileType,
        types.projectType,
        types.newProjectInputType,
        types.updateProjectInputType,
        types.userType],
})