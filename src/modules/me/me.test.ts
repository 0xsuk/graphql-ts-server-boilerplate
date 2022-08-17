import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { DataSource } from "typeorm";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";

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
  test("return null if no cookie", async () => {
    const response = await axios.post(endpoint, {
      query: meQuery,
    });

    expect(response.data.data.me).toBeNull();
  });

  test("get current user", async () => {
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar }));
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
  });
});
