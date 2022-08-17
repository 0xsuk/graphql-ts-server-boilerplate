import { User } from "../../entity/User";
import * as bcrypt from "bcryptjs";
import { ResolverMap } from "../../graphql-utils";
import { MutationLoginArgs } from "../../types/schema";
import { confirmEmailError, invalidLogin } from "./errorMessages";
import { userSessionIdPrefix } from "../../constants";

const errorResponse = [
  {
    path: "email",
    message: invalidLogin, //err message has to be generic, so it won't let hackers guess if user is registered in database
  },
];

export const resolvers: ResolverMap = {
  Mutation: {
    login: async (
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
        await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
      }

      return null;
    },
  },
};
