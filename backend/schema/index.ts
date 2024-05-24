import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import * as types from './typeDefs';
import { userResolver, workspaceResolver, workspacesResolver} from "./resolvers";

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
                    workspaceId: { type: GraphQLString }
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
            }      
        },
    }),
    types: [
        types.MemberStatus, 
        types.WorkspaceStatus, 
        types.workspaceType, 
        types.memberType, 
        types.userType],
})