import { GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { issueType } from "./issues";
import { projectIssuesResolver } from "../resolvers/issues";


export const newProjectInputType = new GraphQLInputObjectType({
    name: 'NewProjectInput',
    description: 'Input for creating a new project',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        targetDate: { type: GraphQLString },
        startDate: { type: GraphQLString },
        meta: { type: GraphQLString },
    }),
});

export const updateProjectInputType = new GraphQLInputObjectType({
    name: 'UpdateProjectInput',
    description: 'Input for updating a project',
    fields: () => ({
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        statusId: { type: GraphQLString },
        targetDate: { type: GraphQLString },
        startDate: { type: GraphQLString },
        meta: { type: GraphQLString },
    }),
});

export const ProjectStatusType = new GraphQLObjectType({
    name: 'ProjectStatus',
    description: 'Status of an project',
    fields: () => ({
        id: { type: (GraphQLID) },
        name: { type: (GraphQLString) },
        color: { type: (GraphQLString) },
        description: { type: (GraphQLString) },
    }),
});

export const projectType = new GraphQLObjectType({
    name: 'Project',
    description: 'A project in a workspace',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        status: { type:  ProjectStatusType },
        targetDate: { type: GraphQLString },
        startDate: { type: GraphQLString },
        meta: { type: GraphQLString },
        issues: { type: new GraphQLList(issueType), resolve: projectIssuesResolver },
    }),
});



export const ProjectGraphqlTypes = {
    newProjectInputType,
    updateProjectInputType,
    projectType
}