import { IResolvers } from 'graphql-tools'
import { QueryTestArgs } from '../generated/graphql';

export const GameResultResolvers: IResolvers = {
    Query: {
        async test(_: void, args: QueryTestArgs): Promise<string> {
            return "ça marche"
        }
    }
}