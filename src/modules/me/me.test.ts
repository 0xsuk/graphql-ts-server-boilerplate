import { DataSource } from "typeorm";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { TestClient } from "../../utils/TestClient";

let conn: DataSource;
const endpoint = process.env.TEST_HOST as string;
let userId: string;
const email = "asdf@email.com";
const password = "asdfasdf";

export const loginAndQueryMeTest = async (client: TestClient) => {
  await client.login(email, password);

  const res = await client.me(); //if error, check typo in schema.graphql

  expect(res.data.data).toEqual({
    me: {
      id: userId,
      email,
    },
  });

  return client;
};

export const noCookieTest = async (client: TestClient) => {
  const res = await client.me();

  expect(res.data.data.me).toBeNull();
};

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

describe("me", () => {
  const client = new TestClient(endpoint);
  test("return null if no cookie", async () => {
    await noCookieTest(client);
  });

  test("get current user", async () => {
    await loginAndQueryMeTest(client);
  });
});
