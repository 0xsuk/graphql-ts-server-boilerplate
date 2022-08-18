import { ResolverMap } from "../../types/graphql-utils";
export const resolvers: ResolverMap = {
  Mutation: {
    logout: async (_, __, { session }) => {
      const { userId } = session;
      if (userId) {
        session.destroy((err) => {
          if (err) {
            //TODO
          }
        });
      }

      return false;
    },
  },
};
