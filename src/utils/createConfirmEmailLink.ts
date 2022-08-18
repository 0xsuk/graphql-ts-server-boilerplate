import Redis from "ioredis";
import { v4 } from "uuid";
import { confirmEmailPrefix } from "../constants/redis";

export const createConfirmEmailLink = async (userId: string, redis: Redis) => {
  const id = v4();
  await redis.set(`${confirmEmailPrefix}${id}`, userId, "EX", 60 * 60 * 24); //24 hours
  //test url in frontend code
  const fullUrl = new URL(
    `confirm/${id}`,
    process.env.FRONTEND_HOST as string
  ).toString();
  return fullUrl;
};
