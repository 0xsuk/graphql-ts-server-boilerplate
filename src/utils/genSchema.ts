import { GraphQLSchema } from "graphql";
import * as path from "path";
import * as fs from "fs";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { makeExecutableSchema, mergeSchemas } from "@graphql-tools/schema";

export const genSchema = () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, "../modules"));
  folders.forEach((folder) => {
    const { resolvers } = require(`../modules/${folder}/resolvers`);
    if (!resolvers) {
      throw Error("resolvers not found for folder: " + folder);
    }
    //https://www.graphql-tools.com/docs/migration/migration-from-import
    const typeDefs = loadSchemaSync(
      path.join(__dirname, `../modules/${folder}/schema.graphql`),
      {
        loaders: [new GraphQLFileLoader()],
      }
    );
    if (!typeDefs) {
      throw Error("typeDefs not found for folder: " + folder);
    }

    schemas.push(makeExecutableSchema({ typeDefs, resolvers }));
  });

  return mergeSchemas({ schemas });
};
