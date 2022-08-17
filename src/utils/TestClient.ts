import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

const registerMutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;
const loginMuation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;
const logoutMutation = `
mutation {
  logout
}`;
const meQuery = `
{
  me {
    id
    email
  }
}
`;

export class TestClient {
  url: string;
  client: AxiosInstance;
  constructor(url: string) {
    this.url = url;
    const jar = new CookieJar();
    this.client = wrapper(axios.create({ jar }));
  }

  async register(email: string, password: string) {
    return this.client.post(this.url, {
      query: registerMutation(email, password),
    });
  }
  async login(email: string, password: string) {
    return this.client.post(this.url, {
      query: loginMuation(email, password),
    });
  }

  async logout() {
    return this.client.post(this.url, {
      query: logoutMutation,
    });
  }

  async me() {
    return this.client.post(this.url, { query: meQuery });
  }
}
