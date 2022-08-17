import { Request, Response } from "express";
import { confirmEmailPrefix } from "../constants";
import { User } from "../entity/User";
import { redis } from "../redis";

export const confirmEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = await redis.get(`${confirmEmailPrefix}${id}`);
  if (!userId) {
    res.send("invalid");
    return;
  }
  await User.update({ id: userId }, { confirmed: true });
  await redis.del(`${confirmEmailPrefix}${id}`);
  res.send("ok");
};
