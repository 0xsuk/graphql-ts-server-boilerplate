import { Redis } from "ioredis";
import { User } from "../entity/User";
import { createResetPasswordLink } from "./createResetPasswordLink";
import { sendEmail } from "./sendEmail";

const genResetPasswordEmailBody = (link: string) => {
  const text = `change password from this link: ${link}`;

  return text;
};

export const sendResetPasswordEmail = async (userId: string, redis: Redis) => {
  const user = (await User.findOne({ where: { id: userId } })) as User;
  const email = user.email;
  const link = await createResetPasswordLink(userId, redis);
  const emailBody = genResetPasswordEmailBody(link);
  await sendEmail(email, "Reset your password", emailBody);
};
