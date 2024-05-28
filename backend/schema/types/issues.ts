import { GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { memberType } from "./workspaces";

export const updateIssueInputType = new GraphQLInputObjectType({
    name: 'UpdateIssueInput',
    description: 'Input for updating an issue',
    fields: () => ({
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        statusid: { type: GraphQLID },
        startDate: { type: GraphQLString },
        targetDate: { type: GraphQLString },
        assigness: { type: new GraphQLList(GraphQLID) },
        projects: { type: new GraphQLList(GraphQLID) },
    }),
});

export const deleteIssueInputType = new GraphQLInputObjectType({
    name: 'DeleteIssueInput',
    description: 'Input for deleting an issue',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
    }),
});

export const newIssueInputType = new GraphQLInputObjectType({
    name: 'NewIssueInput',
    description: 'Input for creating a new issue',
    fields: () => ({
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        statusid: { type: new GraphQLNonNull(GraphQLID) },
        startDate: { type: GraphQLString },
        targetDate: { type: GraphQLString },
        assignees: { type: new GraphQLList(GraphQLID) },
        projects: { type: new GraphQLList(GraphQLID) },
    }),
});

export const issueType = new GraphQLObjectType({
    name: 'Issue',
    description: 'An issue in a project',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(GraphQLString) },
        startDate: { type: GraphQLString },
        targetDate: { type: GraphQLString },
        dateCreated: { type: new GraphQLNonNull(GraphQLString) },
        dateUpdated: { type: new GraphQLNonNull(GraphQLString) },
        assignees: { type: new GraphQLList (memberType) },
    }),
});

export const issueStatusType = new GraphQLObjectType({
    name: 'IssueStatus',
    description: 'Status of an issue',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        color: { type: (GraphQLString) },
        description: { type: (GraphQLString) },
    }),
});



export const IssueGraphQLTypes = {
    updateIssueInputType,
    deleteIssueInputType,
    newIssueInputType,
    issueType,
    issueStatusType,

}