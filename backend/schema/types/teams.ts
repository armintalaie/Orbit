import { GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import {memberType} from "./workspaces.ts";

export const teamType = new GraphQLObjectType({
    name: 'Team',
    description: 'A team in a workspace',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        identifier: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        members: { type: new GraphQLList(memberType) },
    }),
});

export const newTeamInputType = new GraphQLInputObjectType({
    name: 'NewTeamInput',
    description: 'Input for creating a new team',
    fields: () => ({
        identifier: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        members: { type: new GraphQLList(GraphQLID) },
    }),
});

export const updateTeamInputType = new GraphQLInputObjectType({
    name: 'UpdateTeamInput',
    description: 'Input for updating a team',
    fields: () => ({
        identifier: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        members: { type: new GraphQLList(GraphQLID) },
    }),
});


export const TeamGraphQLTypes = {
    teamType,
    newTeamInputType,
    updateTeamInputType,
}

