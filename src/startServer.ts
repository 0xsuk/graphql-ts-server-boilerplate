import { createServer } from "@graphql-yoga/node";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { createTypeormConn } from "./utils/createTypeormConn";
import * as fs from "fs";
import * as path from "path";
import { makeExecutableSchema, mergeSchemas } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";
import Redis from "ioredis";
import * as express from "express";
import { User } from "./entity/User";

export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, "./modules"));
  folders.forEach((folder) => {
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    //https://www.graphql-tools.com/docs/migration/migration-from-import
    const typeDefs = loadSchemaSync(
      path.join(__dirname, `./modules/${folder}/schema.graphql`),
      {
        loaders: [new GraphQLFileLoader()],
      }
    );

    schemas.push(makeExecutableSchema({ typeDefs, resolvers }));
  });

  const redis = new Redis();

  const graphQLServer = createServer({
    schema: mergeSchemas({ schemas }),
    context: ({ request }) => ({
      redis,
      url: request.url,
    }),
  });

  const app = express();
  app.use("/graphql", graphQLServer);

  app.get("/confirm/:id", async (req, res) => {
    const { id } = req.params;
    const userId = await redis.get(id);
    if (!userId) {
      res.send("link does not exist");
      return;
    }
    User.update({ id: userId }, { confirmed: true });
    res.send("ok");
  });

  //https://github.com/typeorm/typeorm/issues/7428
  //https://typeorm.io/data-source
  await createTypeormConn();

  const port = process.env.NODE_ENV === "test" ? 0 : 4000;
  return app.listen(port, () => {
    console.log("Server is running on port", port);
  });
};
