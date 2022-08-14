import request from "graphql-request";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { confirmEmailError, invalidLogin } from "./errorMessages";

const endpoint = process.env.TEST_HOST as string;

const email = "rightemail@email.com";
const password = "rightpassword";

const registerMutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const loginMuation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const loginExpectError = async (e: string, p: string, errMsg: string) => {
  const response = await request(endpoint, loginMuation(e, p));

  expect(response).toEqual({
    login: [
      {
        path: "email",
        message: errMsg,
      },
    ],
  });
};

beforeAll(async () => {
  await createTypeormConn();
});

describe("Login", () => {
  test("email not found send back error", async () => {
    await loginExpectError("login@test.com", "myloginpas", invalidLogin);
  });

  test("email not confirmed", async () => {
    await request(endpoint, registerMutation(email, password));

    await loginExpectError(email, password, confirmEmailError);

    await User.update({ email }, { confirmed: true });

    await loginExpectError(email, "bad password", invalidLogin);

    const response = await request(endpoint, loginMuation(email, password));

    expect(response).toEqual({
      login: null,
    });
  });
});
