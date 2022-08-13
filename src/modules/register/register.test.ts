import request from "graphql-request";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "./errorMessages";

let endpoint = process.env.TEST_HOST + "/graphql";

const email = "toasdfp@bob.com";
const password = "jasdf";

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

beforeAll(async () => {
  await createTypeormConn();
});

describe("Register User", () => {
  it("check for duplicate emails", async () => {
    const response = await request(endpoint, mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } }); //accessing database directly, we have to explicitly specify datasource here again(why?)
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
    const response2 = await request(endpoint, mutation(email, password));
    expect(response2.register).toEqual([
      {
        path: "email",
        message: duplicateEmail,
      },
    ]);
  });

  it("check bad email", async () => {
    const response3 = await request(endpoint, mutation("a", password));
    expect(response3.register).toEqual([
      {
        path: "email",
        message: emailNotLongEnough,
      },
      {
        path: "email",
        message: invalidEmail,
      },
    ]); //order matters
  });

  it("check bad password", async () => {
    const response4 = await request(endpoint, mutation(email, "a"));
    expect(response4.register).toEqual([
      {
        path: "password",
        message: passwordNotLongEnough,
      },
    ]); //order matters
  });

  it("check bad email and password", async () => {
    const response5 = await request(endpoint, mutation("a", "a"));
    expect(response5.register).toEqual([
      {
        path: "email",
        message: emailNotLongEnough,
      },
      {
        path: "email",
        message: invalidEmail,
      },
      {
        path: "password",
        message: passwordNotLongEnough,
      },
    ]); //order matters
  });
});
