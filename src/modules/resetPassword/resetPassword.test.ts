import { DataSource } from "typeorm";
import {
  idInvalidOrExpired,
  passwordNotLongEnough,
} from "../../constants/errorMessages";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { createResetPasswordLink } from "../../utils/createResetPasswordLink";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { TestClient } from "../../utils/TestClient";

const endpoint = process.env.TEST_HOST as string;
const email = "correct@email.com";
const password = "correctpassword";
const newPassword = "newpassword";
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

describe("Reset Password", () => {
  test("bad password", async () => {
    const link = await createResetPasswordLink(userId, redis);
    const chunks = link.split("/");
    const id = chunks[chunks.length - 1];

    const client = new TestClient(endpoint);
    {
      //too short password
      const res = await client.resetPassword("ba", id);
      expect(res.data.data).toEqual({
        resetPassword: [
          {
            path: "password", //TODO
            message: passwordNotLongEnough,
          },
        ],
      });
    }
  });
  test("invalid resetPassword id", async () => {
    const client = new TestClient(endpoint);
    {
      const res = await client.resetPassword(newPassword, "bad_id");
      expect(res.data.data).toEqual({
        resetPassword: [
          {
            path: "id",
            message: idInvalidOrExpired,
          },
        ],
      });
    }
  });
  test("valid password and id", async () => {
    const link = await createResetPasswordLink(userId, redis);
    const chunks = link.split("/");
    const id = chunks[chunks.length - 1];

    const client = new TestClient(endpoint);

    {
      //valid password and id
      const res = await client.resetPassword(newPassword, id);
      expect(res.data.data).toEqual({
        resetPassword: null,
      });
    }
  });
});
