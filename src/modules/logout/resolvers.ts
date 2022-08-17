import { ResolverMap } from "../../graphql-utils";

export const resolvers: ResolverMap = {
  Mutation: {
    logout: async (_, __, { session }) => {
      session.destroy((err) => {
        if (err) {
          console.log("logout error:", err);
          //return false;
        }

        return true;
      });
    },
  },
};
