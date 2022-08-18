import Redis from "ioredis";
import { DataSource } from "typeorm";
import { resetPasswordPrefix } from "../constants/redis";
import { User } from "../entity/User";
import { createResetPasswordLink } from "./createResetPasswordLink";
import { createTypeormConn } from "./createTypeormConn";
import { TestClient } from "./TestClient";
const endpoint = process.env.TEST_HOST as string;

const email = "validemail@gmail.com";
const password = "rightpassword";
const newPassword = "newpassword";
const redis = new Redis();

let conn: DataSource;
let userId: string;
beforeAll(async () => {
  conn = await createTypeormConn();
  const user = await User.create({
    email,
    password,
    confirmed: true,
  }).save();
  userId = user.id;
});

afterAll(async () => {
  conn.destroy();
});

test("store reset id in redis, then reset password, and clean id in redis", async () => {
  const client = new TestClient(endpoint);

  const url = await createResetPasswordLink(userId, redis);
  const chunks = url.split("/");
  //user obtains this id from resetPassword email and invokes resetPassword mutation by the link
  const id = chunks[chunks.length - 1];

  //change password
  {
    const res = await client.resetPassword(newPassword, id);
    expect(res.data.data).toEqual({
      resetPassword: null,
    });
  }

  //check login succcess with new Password
  {
    const res = await client.login(email, newPassword);
    expect(res.data.data).toEqual({
      login: null,
    });
  }

  {
    const res = await redis.get(`${resetPasswordPrefix}${id}`);
    expect(res).toBeNull();
  }
});
