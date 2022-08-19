import { User } from "../../entity/User";
import { Resolvers } from "../../types/schema";

export const resolvers: Resolvers = {
  Query: {
    me: async (_, __, { session }) => {
      //becareful of undefined: https://github.com/typeorm/typeorm/issues/2500
      if (!session.userId) {
        return null;
      }
      return User.findOne({ where: { id: session.userId } });
    },
  },
};
