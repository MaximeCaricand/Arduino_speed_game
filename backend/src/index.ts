import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql/schemasMap';

const PORT = 4000;

const app = express();
const server = new ApolloServer({ schema });
server.applyMiddleware({ app, path: '/graphql' });

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}/graphql`));