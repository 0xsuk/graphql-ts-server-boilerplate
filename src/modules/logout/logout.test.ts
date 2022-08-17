//import { loginAndQueryMeTest, noCookieTest } from "../me/me.test";

import { DataSource } from "typeorm";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { TestClient } from "../../utils/TestClient";

const endpoint = process.env.TEST_HOST as string;
const email = "right@email.com";
const password = "rightpassword";

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

describe("logout", () => {
  test("single session", async () => {
    const client = new TestClient(endpoint);
    await client.login(email, password);
    {
      const res = await client.me();
      expect(res.data.data).toEqual({
        me: {
          id: userId,
          email,
        },
      });
    }
    await client.logout();
    {
      const res = await client.me();
      expect(res.data.data.me).toBeNull();
    }
  });

  test("multiple sessions", async () => {
    // computer 1
    const sess1 = new TestClient(endpoint);
    // computer 2
    const sess2 = new TestClient(endpoint);

    await sess1.login(email, password);
    await sess2.login(email, password);

    {
      const res1 = await sess1.me();
      const res2 = await sess2.me();
      expect(res1.data).toEqual(res2.data);
    }
    await sess1.logout();
    {
      const res1 = await sess1.me();
      const res2 = await sess2.me();
      expect(res1.data).toEqual(res2.data);
    }
  });
});
