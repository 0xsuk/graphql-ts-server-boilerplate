import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

export const testHttpClient = (): AxiosInstance => {
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));
  return client;
};
