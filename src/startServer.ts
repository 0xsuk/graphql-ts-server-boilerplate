import { createServer } from "@graphql-yoga/node";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { createTypeormConn } from "./utils/createTypeormConn";
import * as fs from "fs";
import * as path from "path";
import { makeExecutableSchema, mergeSchemas } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";

export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, "./modules"));
  folders.forEach((folder) => {
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefs = loadSchemaSync(
      path.join(__dirname, `./modules/${folder}/schema.graphql`),
      {
        loaders: [new GraphQLFileLoader()],
      }
    );

    schemas.push(makeExecutableSchema({ typeDefs, resolvers }));
  });

  //https://www.graphql-tools.com/docs/migration/migration-from-import

  const server = createServer({
    schema: mergeSchemas({ schemas }),
    port: process.env.NODE_ENV === "test" ? 0 : 4000, //TODO what is port 0?
  });

  //https://github.com/typeorm/typeorm/issues/7428
  //https://typeorm.io/data-source
  await createTypeormConn();
  const app = await server.start();
  console.log("Server is running on localhost:4000");

  return app;
};
