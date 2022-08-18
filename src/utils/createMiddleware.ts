import { GraphQLMiddlwareFunc, Resolver } from "../types/graphql-utils";

export const createMiddleware =
  (middlewareFunc: GraphQLMiddlwareFunc, resolverFunc: Resolver): Resolver =>
  (parent, args, context, info) =>
    middlewareFunc(resolverFunc, parent, args, context, info);
