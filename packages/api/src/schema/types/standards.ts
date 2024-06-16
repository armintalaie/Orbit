import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLEnumType } from 'graphql';

export const responseStatusEnumType = new GraphQLEnumType({
  name: 'ResponseStatus',
  description: 'Status of the response',
  values: {
    SUCCESS: { value: 'success' },
    ERROR: { value: 'error' },
    INFO: { value: 'info' },
  },
});

export const standardResponseType = new GraphQLObjectType({
  name: 'StandardResponses',
  description: 'Standard responses for the API',
  fields: () => ({
    message: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(responseStatusEnumType) },
  }),
});

export const StandardGraphqlTypes = {
  responseStatusEnumType,
  standardResponseType,
};
