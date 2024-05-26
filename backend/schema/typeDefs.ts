import { GraphQLEnumType, GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { membersResolver, workspaceProjectsResolver } from "./resolvers";

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
        status: { type: GraphQLString },
        targetDate: { type: GraphQLString },
        startDate: { type: GraphQLString },
        meta: { type: GraphQLString },
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
        status: { type: GraphQLString },
        targetDate: { type: GraphQLString },
        startDate: { type: GraphQLString },
        meta: { type: GraphQLString },
    }),
});