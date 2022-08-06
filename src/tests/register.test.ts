import request from "graphql-request";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { host } from "./constants";

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

  await AppDataSource.initialize();
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
