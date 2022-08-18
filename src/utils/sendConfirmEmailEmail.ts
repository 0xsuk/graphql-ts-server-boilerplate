import { Redis } from "ioredis";
import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { sendEmail } from "./sendEmail";

const genConfirmEmailEmailBody = (link: string) => {
  const text = `confirm email: ${link}`;

  return text;
};

export const sendConfirmEmailEmail = async (
  email: string,
  userId: string,
  redis: Redis
) => {
  const link = await createConfirmEmailLink(userId, redis);
  const emailBody = genConfirmEmailEmailBody(link);
  await sendEmail(email, "Confirm your email", emailBody);
};
