import { DataSource } from "typeorm";
import { confirmEmailPrefix } from "../constants/redis";
import { User } from "../entity/User";
import { redis } from "../redis";
import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeormConn } from "./createTypeormConn";
import { TestClient } from "./TestClient";

const endpoint = process.env.TEST_HOST as string;

let conn: DataSource;

beforeAll(async () => {
  conn = await createTypeormConn();
});

afterAll(async () => {
  conn.destroy();
});

it("store confirm id in redis, then confirm user, and clean id in redis", async () => {
  let user = await User.create({
    email: "bob5@email.com",
    password: "asdfasdf",
  }).save(); //gives error for the second test run, cause dropschema is not executed somehow

  //store id in redis
  const url = await createConfirmEmailLink(user.id, redis);
  const chunks = url.split("/");
  const id = chunks[chunks.length - 1];

  const client = new TestClient(endpoint);
  //confirm user!
  const res = await client.confirmEmail(id);
  expect(res.data.data).toEqual({
    confirmEmail: null,
  });
  user = (await User.findOne({ where: { id: user.id } })) as User;
  //user should be now confirmed
  expect(user.confirmed).toBeTruthy();

  const value = await redis.get(`${confirmEmailPrefix}${id}`);
  //redis data should be deleted
  expect(value).toBeNull();
});
