import { IResolvers } from 'graphql-tools';
import { merge } from 'lodash';
import { GameResultResolvers } from './resolvers/gameResultResolver';

const resolversMap: IResolvers = merge(GameResultResolvers);
export default resolversMap;