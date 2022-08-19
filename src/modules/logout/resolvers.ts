import { Resolvers } from "../../types/schema";

export const resolvers: Resolvers = {
  Mutation: {
    logout: async (_, __, { session }) => {
      const { userId } = session;
      if (userId) {
        session.destroy((err: any) => {
          if (err) {
            //TODO
          }
        });
      }

      return false;
    },
  },
};
