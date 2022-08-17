import { redisSessionPrefix, userSessionIdPrefix } from "../../constants";
import { ResolverMap } from "../../graphql-utils";
export const resolvers: ResolverMap = {
  Mutation: {
    logout: async (_, __, { redis, session }) => {
      const { userId } = session;
      if (userId) {
        const sessionIds = await redis.lrange(
          `${userSessionIdPrefix}${userId}`,
          0,
          -1
        );

        const promises = [];

        for (let i = 0; i < sessionIds.length; i++) {
          promises.push(redis.del(`${redisSessionPrefix}${sessionIds[i]}`));
        }
        await Promise.all(promises);
      }

      return false;
    },
  },
};
