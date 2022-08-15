import * as yup from "yup";
import { User } from "../../entity/User";
import { ResolverMap } from "../../graphql-utils";
import { MutationRegisterArgs } from "../../types/schema";
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";
import { formatYupError } from "../../utils/formatYupError";
import { sendEmail } from "../../utils/sendEmail";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "./errorMessages";

const schema = yup.object().shape({
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_, args: MutationRegisterArgs, { redis, url }) => {
      try {
        await schema.validate(args, { abortEarly: false }); //await is important
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
        await sendEmail(
          email,
          await createConfirmEmailLink(url, user.id, redis)
        );
      }
      return null;
    },
  },
};
