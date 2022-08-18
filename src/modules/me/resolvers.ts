import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { createMiddleware } from "../../utils/createMiddleware";
import middleware from "./middleware";

export const resolvers: ResolverMap = {
  Query: {
    me: createMiddleware(middleware, (_, __, { session }) =>
      //becareful of undefined: https://github.com/typeorm/typeorm/issues/2500
      User.findOne({ where: { id: session.userId } })
    ),
  },
};
