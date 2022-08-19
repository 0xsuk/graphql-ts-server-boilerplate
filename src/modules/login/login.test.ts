import { DataSource } from "typeorm";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { TestClient } from "../../utils/TestClient";
import { emailNotConfirmed, invalidLogin } from "../../constants/errorMessages";
import { Error } from "../../types/schema";

const endpoint = process.env.TEST_HOST as string;

const email = "rightemail@email.com";
const password = "rightpassword";

interface loginResType {
  login: [Error] | null;
}

const loginExpectError = async (response: loginResType, errMsg: string) => {
  expect(response).toEqual({
    login: [
      {
        path: "email",
        message: errMsg,
      },
    ],
  });
};

let conn: DataSource;

beforeAll(async () => {
  conn = await createTypeormConn();
});

afterAll(async () => {
  conn.destroy();
});

describe("Login", () => {
  test("email not found send back error", async () => {
    const client = new TestClient(endpoint);
    const res = await client.login("login@test.com", "myloginpass");
    await loginExpectError(res.data.data, invalidLogin);
  });

  test("email not confirmed / bad password / valid login", async () => {
    const client = new TestClient(endpoint);
    await client.register(email, password);

    //email not confirmed
    {
      const res = await client.login(email, password);
      await loginExpectError(res.data.data, emailNotConfirmed);
    }
    await User.update({ email }, { confirmed: true });

    //bad password
    {
      const res = await client.login(email, "bad password");
      await loginExpectError(res.data.data, invalidLogin);
    }

    //valid login
    {
      const res = await client.login(email, password);
      expect(res.data.data).toEqual({
        login: null,
      });
    }
  });
});
