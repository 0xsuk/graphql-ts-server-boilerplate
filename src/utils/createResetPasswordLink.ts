import Redis from "ioredis";
import { v4 } from "uuid";
import { resetPasswordPrefix } from "../constants/redis";

export const createResetPasswordLink = async (userId: string, redis: Redis) => {
  const id = v4();
  //20 mins
  await redis.set(`${resetPasswordPrefix}${id}`, userId, "EX", 60 * 20);
  const fullUrl = new URL(
    `reset-password/${id}`,
    process.env.FRONTEND_HOST as string
  ).toString();
  return fullUrl;
};
