import { createServer } from "@graphql-yoga/node";

const server = createServer({
  schema: {
    typeDefs: /* GraphQL */ `
      type Query {
        hello(name: String): String!
      }
    `,
    resolvers: {
      Query: {
        hello: (_: any, { name }: any) =>
          `Hello ${name || "World"} from Yoga!!`,
      },
    },
  },
});

server.start();
