import { idInvalidOrExpired } from "../../constants/errorMessages";
import { confirmEmailPrefix } from "../../constants/redis";
import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { MutationConfirmEmailArgs } from "../../types/schema";
import { sendConfirmEmailEmail } from "../../utils/sendConfirmEmailEmail";

export const resolvers: ResolverMap = {
  Mutation: {
    //confirm email is autosent when user registers, but user might want to resend email from here
    sendConfirmEmailEmail: async (_, __, { session, redis }) => {
      const { userId } = session;
      if (!userId) {
        return false;
      }
      const user = (await User.findOne({ where: { id: userId } })) as User;

      await sendConfirmEmailEmail(user.email, userId, redis);

      return true;
    },
    confirmEmail: async (_, { id }: MutationConfirmEmailArgs, { redis }) => {
      const userId = await redis.get(`${confirmEmailPrefix}${id}`);
      if (!userId) {
        return [
          {
            path: "id",
            message: idInvalidOrExpired,
          },
        ];
      }
      await User.update({ id: userId }, { confirmed: true });
      await redis.del(`${confirmEmailPrefix}${id}`);

      return null;
    },
  },
};
