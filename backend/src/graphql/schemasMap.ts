import 'graphql-import-node';
import * as gameResultDefs from './schemas/gameResult.graphql';
import * as emptyTypeDefs from './schemas/empty.graphql';

import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolversMap';
import { GraphQLSchema } from 'graphql';

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs: [emptyTypeDefs, gameResultDefs],
    resolvers
});
export default schema;