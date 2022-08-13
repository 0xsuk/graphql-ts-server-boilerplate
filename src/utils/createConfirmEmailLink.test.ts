import axios from "axios";
import Redis from "ioredis";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeormConn } from "./createTypeormConn";

let redis = new Redis();

let conn: DataSource;

beforeAll(async () => {
  conn = await createTypeormConn();
});

afterAll(async () => {
  conn.destroy();
  //console.log("connection destroyed", conn !== undefined);
});

it("check it confirms user and cleans key in redis", async () => {
  let user = await User.create({
    email: "bob5@email.com",
    password: "asdfasdf",
  }).save(); //gives error for the second test run, cause dropschema is not executed somehow

  const url = await createConfirmEmailLink(
    process.env.TEST_HOST as string,
    user.id,
    redis
  );

  const response = await axios.get(url);

  const text = await response.data;
  expect(text).toEqual("ok");
  user = (await User.findOne({ where: { id: user.id } })) as User;

  expect(user.confirmed).toBeTruthy();

  const chunks = url.split("/");
  const key = chunks[chunks.length - 1];
  const value = await redis.get(key);

  expect(value).toBeNull();
});
