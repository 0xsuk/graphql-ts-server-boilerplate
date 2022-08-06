import { createServer } from "@graphql-yoga/node";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { join } from "path";
import { resolvers } from "./resolvers";
//https://www.graphql-tools.com/docs/migration/migration-from-import
const typeDefs = loadSchemaSync(join(__dirname, "schema.graphql"), {
  loaders: [new GraphQLFileLoader()],
});

const server = createServer({
  schema: {
    typeDefs,
    resolvers: {
      Query: {
        hello: (_: any, { name }: any) =>
          `Hello ${name || "World"} from Yoga!!`,
      },
    },
  },
});

server.start();
