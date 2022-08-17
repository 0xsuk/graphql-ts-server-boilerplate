import { User } from "../../entity/User";
import * as bcrypt from "bcryptjs";
import { ResolverMap } from "../../graphql-utils";
import { MutationLoginArgs } from "../../types/schema";
import { userSessionIdPrefix } from "../../constants";

export const resolvers: ResolverMap = {
  Mutation: {
    sendForgotPasswordEmail: async (
      _,
      { email, password }: MutationLoginArgs,
      { redis, session, req }
    ) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return [
          {
            path: "email",
            message: confirmEmailError,
          },
        ];
      }

      //TODO?: time (if significant) consumed by User.findOne might let hackers know if user is registered in db

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return errorResponse;
      }

      //login successfull
      session.userId = user.id;
      if (req.sessionID) {
        console.log("redis.lpush(userid, " + req.sessionID + ")");
        await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
      }

      return null;
    },
  },
};
