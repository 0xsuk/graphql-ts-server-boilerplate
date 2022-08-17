import Redis from "ioredis";
import { DataSource } from "typeorm";
import { User } from "../../entity/User";
import { createForgotPasswordLink } from "../../utils/createForgotPasswordLink";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { TestClient } from "../../utils/TestClient";

const endpoint = process.env.TEST_HOST as string;
const email = "right@email.com";
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

describe("forgot password", () => {
  test("test", async () => {
    const client = new TestClient(endpoint);

    const url = await createForgotPasswordLink(
      process.env.TEST_HOST as string,
      userId,
      redis
    );

    const chunks = url.split("/");
    const key = chunks[chunks.length];

    //change password
    {
      const res = await client.forgotPasswordChange(newPassword, key);
      expect(res.data.data).toEqual({
        forgotPasswordChange: null,
      });
    }

    //check login succcess with new Password
    {
      const res = await client.login(email, newPassword);
      expect(res.data.data).toEqual({
        login: null,
      });
    }
  });
});
