import request from "graphql-request";
import { User } from "../entity/User";
import { createTypeormConn } from "../utils/createTypeormConn";
import { host } from "./constants";

beforeAll(async () => {
  await createTypeormConn();
});

const email = "toasdfp@bob.com";
const password = "jasdf";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
}
`;

test("Register User", async () => {
  const response = await request(host + "/graphql", mutation);
  expect(response).toEqual({ register: true });

  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
