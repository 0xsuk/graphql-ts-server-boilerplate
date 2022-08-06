import { createServer } from "@graphql-yoga/node";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { join } from "path";
import { AppDataSource } from "./data-source";
import { resolvers } from "./resolvers";

export const startServer = async () => {
  //https://www.graphql-tools.com/docs/migration/migration-from-import
  const typeDefs = loadSchemaSync(join(__dirname, "schema.graphql"), {
    loaders: [new GraphQLFileLoader()],
  });

  const server = createServer({
    schema: {
      typeDefs,
      resolvers,
    },
  });

  //https://github.com/typeorm/typeorm/issues/7428
  //https://typeorm.io/data-source
  await AppDataSource.initialize();
  await server.start();
};

startServer();
