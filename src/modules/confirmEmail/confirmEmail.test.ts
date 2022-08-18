import { DataSource } from "typeorm";
import { idInvalidOrExpired } from "../../constants/errorMessages";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { TestClient } from "../../utils/TestClient";

const endpoint = process.env.TEST_HOST as string;

let conn: DataSource;
beforeAll(async () => {
  conn = await createTypeormConn();
});

afterAll(async () => {
  conn.destroy();
});

test("invalid confirm id", async () => {
  const client = new TestClient(endpoint);
  const res = await client.confirmEmail("random_bad_id");
  expect(res.data.data).toEqual({
    confirmEmail: [
      {
        path: "id",
        message: idInvalidOrExpired,
      },
    ],
  });
});
