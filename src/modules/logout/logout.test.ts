import { testHttpClient } from "../../utils/testHttpClient";
import { loginAndQueryMeTest, noCookieTest } from "../me/me.test";

const endpoint = process.env.TEST_HOST as string;

const logoutMutation = `
mutation {
  logout
}`;

//TODO import from other test file invokes the test
describe("logout", () => {
  test("test loggin out a user", async () => {
    const client = testHttpClient();
    await loginAndQueryMeTest(client);

    await client.post(endpoint, { query: logoutMutation });

    await noCookieTest(client);
  });
});
