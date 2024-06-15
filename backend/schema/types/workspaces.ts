import {
    GraphQLEnumType,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from "graphql";
import { issueStatusType } from "./issues";
import { projectType } from "./projects";
import { workspaceProjectsResolver } from "../resolvers/projects";
import {memberResolver, membersResolver, workspaceConfigResolver} from "../resolvers/workspaces";
import {teamType} from "./teams.ts";
import {teamsResolver, workspaceTeamsResolver} from "../resolvers/teams.ts";

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
        member: { type: memberType, resolve: memberResolver },
        teams: { type: (new GraphQLList (teamType)) , resolve: workspaceTeamsResolver},
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


export const newWorkspaceInputType = new GraphQLInputObjectType({
    name: 'NewWorkspaceInput',
    description: 'Input for creating a new workspace',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

export const updateWorkspaceInputType = new GraphQLInputObjectType({
    name: 'UpdateWorkspaceInput',
    description: 'Input for updating a workspace',
    fields: () => ({
        name: { type: GraphQLString },
    }),
});

export const newMemberInputType = new GraphQLInputObjectType({
    name: 'NewMemberInput',
    description: 'Input for adding a new member to a workspace',
    fields: () => ({
        email: { type: new GraphQLNonNull(GraphQLString) },
    }),
});


export const updateMemberInputType = new GraphQLInputObjectType({
    name: 'UpdateMemberInput',
    description: 'Input for updating a member in a workspace',
    fields: () => ({
        username: { type: (GraphQLString) },
        firstName: { type: (GraphQLString) },
        lastName: { type: (GraphQLString) },
        pronouns: { type: (GraphQLString) },
        location: { type: GraphQLString },
        avatar: { type: GraphQLString },
        bio: { type: GraphQLString },
    })
});


export const WorkspaceGraphqlTypes = {
    workspaceType,
    memberType,
    userType,
    profileType,
    workspaceConfigType,
    MemberStatus,
    WorkspaceStatus,
    newWorkspaceInputType,
    updateWorkspaceInputType,
    newMemberInputType,
    updateMemberInputType,
}