import { duplicateEmail } from "../../constants/errorMessages";
import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { MutationRegisterArgs } from "../../types/schema";
import { formatYupError } from "../../utils/formatYupError";
import { sendConfirmEmailEmail } from "../../utils/sendConfirmEmailEmail";
import { userSchema } from "../../utils/yupSchemas";

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_, args: MutationRegisterArgs, { redis }) => {
      try {
        await userSchema.validate(args, { abortEarly: false }); //await is important
      } catch (err) {
        return formatYupError(err);
      }

      const { email, password } = args;
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ["id"],
      });
      if (userAlreadyExists) {
        return [
          {
            path: "email",
            message: duplicateEmail,
          },
        ];
      }

      const user = User.create({
        email,
        password,
      });

      await user.save();

      if (process.env.NODE_ENV !== "test") {
        await sendConfirmEmailEmail(email, user.id, redis);
      }
      return null;
    },
  },
};
