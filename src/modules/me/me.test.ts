import { AxiosInstance } from "axios";
import { DataSource } from "typeorm";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { testHttpClient } from "../../utils/testHttpClient";

let conn: DataSource;
const endpoint = process.env.TEST_HOST as string;
let userId: string;
const email = "asdf@email.com";
const password = "asdfasdf";

const loginMuation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const meQuery = `
{
  me {
    id
    email
  }
}
`;

export const loginAndQueryMeTest = async (client: AxiosInstance) => {
  await client.post(endpoint, {
    query: loginMuation(email, password),
  });

  const response = await client.post(endpoint, {
    query: meQuery,
  }); //if error, check typo in schema.graphql

  expect(response.data.data).toEqual({
    me: {
      id: userId,
      email,
    },
  });

  return client;
};

export const noCookieTest = async (client: AxiosInstance) => {
  const response = await client.post(endpoint, {
    query: meQuery,
  });

  expect(response.data.data.me).toBeNull();
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
  const client = testHttpClient();
  test("return null if no cookie", async () => {
    await noCookieTest(client);
  });

  test("get current user", async () => {
    await loginAndQueryMeTest(client);
  });
});
