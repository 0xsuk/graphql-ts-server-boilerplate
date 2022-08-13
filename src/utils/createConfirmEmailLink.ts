import Redis from "ioredis";
import { v4 } from "uuid";
// http://localhost:4000
// https://my-site.com
// => https://my-site.com/confirm/<id>
export const createConfirmEmailLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = v4();
  await redis.set(id, userId, "EX", 60 * 60 * 24);
  const fullUrl = new URL(`confirm/${id}`, url).toString();
  return fullUrl;
};
