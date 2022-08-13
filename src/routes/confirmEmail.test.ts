import axios from "axios";

it("sends invalid back if bad id is sent", async () => {
  const response = await axios.get(`${process.env.TEST_HOST}/confirm/12312312`);

  const text = await response.data;
  expect(text).toEqual("invalid");
});
