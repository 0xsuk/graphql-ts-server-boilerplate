import { DataSource } from "typeorm";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { TestClient } from "../../utils/TestClient";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "./errorMessages";

const endpoint = process.env.TEST_HOST as string;
const email = "toasdfp@bob.com";
const password = "jasdf";

let conn: DataSource;

beforeAll(async () => {
  conn = await createTypeormConn();
});

afterAll(async () => {
  conn.destroy();
});

describe("Register User", () => {
  it("duplicate emails", async () => {
    const client = new TestClient(endpoint);
    {
      const res = await client.register(email, password);
      expect(res.data.data).toEqual({ register: null });
    }
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    {
      const res = await client.register(email, password);
      expect(res.data.data).toEqual({
        register: [
          {
            path: "email",
            message: duplicateEmail,
          },
        ],
      });
    }
  });

  it("check bad email", async () => {
    const client = new TestClient(endpoint);
    const res = await client.register("ba", password);
    expect(res.data.data).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough,
        },
        {
          path: "email",
          message: invalidEmail,
        },
      ],
    }); //order matters
  });

  it("check bad password", async () => {
    const client = new TestClient(endpoint);
    const res = await client.register(email, "ba");
    expect(res.data.data).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough,
        },
      ],
    }); //order matters
  });

  it("check bad email and password", async () => {
    const client = new TestClient(endpoint);
    const res = await client.register("b", "b");
    expect(res.data.data).toEqual({
      register: [
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
      ],
    }); //order matters
  });
});
