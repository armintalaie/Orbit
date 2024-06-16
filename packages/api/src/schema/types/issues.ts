import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { memberType } from './workspaces.js';

export const updateIssueInputType = new GraphQLInputObjectType({
  name: 'UpdateIssueInput',
  description: 'Input for updating an issue',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    statusId: { type: GraphQLID },
    targetDate: { type: GraphQLString },
    assigness: { type: new GraphQLList(GraphQLID) },
    projects: { type: new GraphQLList(GraphQLID) },
    teamId: { type: GraphQLID },
  }),
});

export const deleteIssueInputType = new GraphQLInputObjectType({
  name: 'DeleteIssueInput',
  description: 'Input for deleting an issue',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const issueStatusType = new GraphQLObjectType({
  name: 'IssueStatus',
  description: 'Status of an issue',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    color: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

export const newIssueInputType = new GraphQLInputObjectType({
  name: 'NewIssueInput',
  description: 'Input for creating a new issue',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    statusId: { type: new GraphQLNonNull(GraphQLString) },
    targetDate: { type: GraphQLString },
    assignees: { type: new GraphQLList(GraphQLID) },
    projects: { type: new GraphQLList(GraphQLString) },
    teamId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const issueType = new GraphQLObjectType({
  name: 'Issue',
  description: 'An issue in a project',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(issueStatusType) },
    targetDate: { type: GraphQLString },
    dateCreated: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
    assignees: { type: new GraphQLList(memberType) },
    teamId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const IssueGraphQLTypes = {
  updateIssueInputType,
  deleteIssueInputType,
  newIssueInputType,
  issueType,
  issueStatusType,
};
