import { User } from "../../entity/User";
import { ResolverMap } from "../../graphql-utils";
import { createMiddleware } from "../../utils/createMiddleware";
import middleware from "./middleware";

export const resolvers: ResolverMap = {
  Query: {
    me: createMiddleware(middleware, async (_, __, { session }) => {
      const user = await User.findOne({ where: { id: session.userId } });

      if (!user) {
        return null;
      }

      return user;
    }),
  },
};
