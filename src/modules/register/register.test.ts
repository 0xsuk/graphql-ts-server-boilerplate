import request from "graphql-request";
import { AddressInfo } from "net";
import { User } from "../../entity/User";
import { startServer } from "../../startServer";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "./errorMessages";

let host = "";

beforeAll(async () => {
  const app = await startServer();

  const { port } = app.address() as AddressInfo;

  host = `http://127.0.0.1:${port}/graphql`;
});

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

describe("Register User", () => {
  it("check correct email and password", async () => {
    const response = await request(host, mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it("check for duplicate emails", async () => {
    const response2 = await request(host, mutation(email, password));
    expect(response2.register).toEqual([
      {
        path: "email",
        message: duplicateEmail,
      },
    ]);
  });

  it("check bad email", async () => {
    const response3 = await request(host, mutation("a", password));
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
    const response4 = await request(host, mutation(email, "a"));
    expect(response4.register).toEqual([
      {
        path: "password",
        message: passwordNotLongEnough,
      },
    ]); //order matters
  });

  it("check bad email and password", async () => {
    const response5 = await request(host, mutation("a", "a"));
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
