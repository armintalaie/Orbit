import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID } from "graphql";
import  {SchemaGraphQLTypes as  GqlTypes} from './types';
import { Resolvers } from "./resolvers";

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
                type: new GraphQLList(GqlTypes.workspaceType),
                resolve: Resolvers.workspacesResolver,
            },
            workspace: {
                description: 'workspaces',
                type: GqlTypes.workspaceType,
                resolve: Resolvers.workspaceResolver,
                args: {
                    id: { type: GraphQLString }
                }
            },
            user: {
                description: 'A user in Orbit',
                type: GqlTypes.userType,
                resolve: Resolvers.userResolver,
                args: {
                    email: { type: GraphQLString },
                    id: { type: GraphQLString }
                }
            },
            me: {
                description: 'The current user',
                type: GqlTypes.userType,
                resolve: Resolvers.meResolver,
            },
            projects: {
                description: 'List of projects',
                type: new GraphQLList(GqlTypes.projectType),
                resolve: Resolvers.projectsResolver,
                args: {
                    workspaceId: { type: GraphQLString }
                }
            },
            project: {
                description: 'A project',
                type: GqlTypes.projectType,
                resolve: Resolvers.projectResolver,
                args: {
                    id: { type: GraphQLString },
                    workspaceId: { type: GraphQLString }
                }
            } ,
            issues: {
                description: 'List of issues',
                type: new GraphQLList(GqlTypes.issueType),
                resolve: Resolvers.issuesResolver,
                args: {
                    projectId: { type: GraphQLString },
                    workspaceId: { type: GraphQLString }
                }
            },
            issue: {
                description: 'An issue',
                type: GqlTypes.issueType,
                resolve: Resolvers.issueResolver,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) },
                    projectId: { type: GraphQLString },
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
                type: GqlTypes.projectType,
                resolve: Resolvers.createProjectResolver,
                args: {
                    workspaceId: { type: new GraphQLNonNull(GraphQLString) },
                    project: { type: new GraphQLNonNull(GqlTypes.newProjectInputType)}
                }
            },
            updateProject: {
                description: 'Update a project',
                type: GqlTypes.projectType,
                resolve: Resolvers.updateProjectResolver,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    workspaceId: { type: new GraphQLNonNull(GraphQLString) },
                    project: { type: new GraphQLNonNull(GqlTypes.updateProjectInputType) }
                }
            },
            deleteProject: {
                description: 'Delete a project',
                type: GqlTypes.standardResponseType,
                resolve: Resolvers.deleteProjectResolver,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    workspaceId: { type: new GraphQLNonNull(GraphQLString) },
                }
            },
            createIssue: {
                description: 'Create an issue',
                type: GqlTypes.issueType,
                resolve: Resolvers.createIssueResolver,
                args: {
                    workspaceId: { type: new GraphQLNonNull(GraphQLString) },
                    issue: { type: new GraphQLNonNull(GqlTypes.newIssueInputType)}
                }
            },
            updateIssue: {
                description: 'Update an issue',
                type: GqlTypes.issueType,
                resolve: Resolvers.updateIssueResolver,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    workspaceId: { type: new GraphQLNonNull(GraphQLString) },
                    issue: { type: new GraphQLNonNull(GqlTypes.updateIssueInputType) }
                }
            },
            deleteIssue: {
                description: 'Delete an issue',
                type: GqlTypes.standardResponseType,
                resolve: Resolvers.deleteIssueResolver,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    workspaceId: { type: new GraphQLNonNull(GraphQLString) },
                }
            }
        },
    }),
})