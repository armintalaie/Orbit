import { GraphQLEnumType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { issueStatusType } from "./issues";
import { projectType } from "./projects";
import { workspaceProjectsResolver } from "../resolvers/projects";
import { membersResolver, workspaceConfigResolver } from "../resolvers/workspaces";

export const MemberStatus = new GraphQLEnumType({
    name: 'MemberStatus',
    description: 'Status of a member in a workspace',
    values:  {
        ACTIVE: { value: 'active' },
        INACTIVE: { value: 'inactive' },
        PENDING: { value: 'pending' },
        IGNORED: { value: 'ignored' },
        BLOCKED: { value: 'blocked' }
    }
});

export const workspaceType = new GraphQLObjectType({
    name: 'Workspace',
    description: 'A workspace in isolation - a collection of projects, teams and members',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLString)},
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(WorkspaceStatus) },
        members: { type: (new GraphQLList (memberType)), resolve: membersResolver },
        projects: { type: (new GraphQLList (projectType)), resolve: workspaceProjectsResolver },
        config: { type: workspaceConfigType , resolve: workspaceConfigResolver},
    }),
});


export const memberType = new GraphQLObjectType({
    name: 'Member',
    description: 'A member of a workspace',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(MemberStatus) },
        profile: { type: new GraphQLNonNull(profileType) },
    
    })
});


export const WorkspaceStatus = new GraphQLEnumType({
    name: 'WorkspaceStatus',
    description: 'Status of a workspace',
    values: {
        ACTIVE: { value: 'active' },
        INACTIVE: { value: 'inactive' }
    }
});


export const userType = new GraphQLObjectType({
    name: 'User',
    description: 'A user in Orbit',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
        workspaces: { type: new GraphQLNonNull(new GraphQLList (workspaceType)) },
    })
});


export const profileType = new GraphQLObjectType({
    name: 'Profile',
    description: 'A user profile for a workspace',
    fields: () => ({
        username: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: (GraphQLString) },
        lastName: { type: (GraphQLString) },
        pronouns: { type: (GraphQLString) },
        location: { type: GraphQLString },
        avatar: { type: GraphQLString },
        bio: { type: GraphQLString },      
    }),
});





export const workspaceConfigType = new GraphQLObjectType({
    name: 'WorkspaceConfig',
    description: 'Configuration for a workspace',
    fields: () => ({
        issueStatus: { type: new GraphQLList (issueStatusType) },
        projectStatus: { type: new GraphQLList (issueStatusType) },
    }),
});



export const WorkspaceGraphqlTypes = {
    workspaceType,
    memberType,
    userType,
    profileType,
    workspaceConfigType,
    MemberStatus,
    WorkspaceStatus
}