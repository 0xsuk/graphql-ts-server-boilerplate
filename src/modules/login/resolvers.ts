import * as bcrypt from "bcryptjs";
import { emailNotConfirmed, invalidLogin } from "../../constants/errorMessages";
import { User } from "../../entity/User";
import { Resolvers } from "../../types/schema";

const errorResponse = [
  {
    path: "email",
    message: invalidLogin, //err message has to be generic, so it won't let hackers guess if user is registered in database
  },
];

export const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { email, password }, { session }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return [
          {
            path: "email",
            message: emailNotConfirmed,
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

      return null;
    },
  },
};
