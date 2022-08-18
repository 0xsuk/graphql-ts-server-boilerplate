import { idInvalidOrExpired } from "../../constants/errorMessages";
import { resetPasswordPrefix } from "../../constants/redis";
import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { MutationResetPasswordArgs } from "../../types/schema";
import { formatYupError } from "../../utils/formatYupError";
import { sendResetPasswordEmail } from "../../utils/sendResetPasswordEmail";
import { passwordSchema } from "../../utils/yupSchemas";

export const resolvers: ResolverMap = {
  Mutation: {
    sendResetPasswordEmail: async (_, __, { redis, session }) => {
      const { userId } = session;
      if (!userId) {
        return false;
      }
      //test do not invoke this mutation
      //if (process.env.NODE_ENV === "test") {
      //  return true;
      //}
      await sendResetPasswordEmail(userId, redis);
      return true;
    },
    resetPassword: async (
      _,
      { newPassword, id }: MutationResetPasswordArgs,
      { redis }
    ) => {
      try {
        await passwordSchema.validate(
          { password: newPassword },
          { abortEarly: false }
        );
      } catch (err) {
        return formatYupError(err);
      }
      const userId = await redis.get(`${resetPasswordPrefix}${id}`);
      if (!userId) {
        return [
          {
            path: "id",
            message: idInvalidOrExpired,
          },
        ];
      }
      const user = (await User.findOne({ where: { id: userId } })) as User;
      user.password = newPassword;
      await user.save();

      await redis.del(`${resetPasswordPrefix}${id}`);

      return null;
    },
  },
};
