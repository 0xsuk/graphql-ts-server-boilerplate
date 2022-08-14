import { createServer } from "@graphql-yoga/node";
import * as express from "express";
import { redis } from "./redis";
import { confirmEmail } from "./routes/confirmEmail";
import { createTypeormConn } from "./utils/createTypeormConn";
import { genSchema } from "./utils/genSchema";

export const startServer = async () => {
  const graphQLServer = createServer({
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.url,
    }),
  });

  const app = express();

  app.get("/confirm/:id", confirmEmail);
  app.use("/", graphQLServer); //has to be at the last of route definitions because graphQLServer intercepts every route
  //https://github.com/typeorm/typeorm/issues/7428
  //https://typeorm.io/data-source
  await createTypeormConn();

  const port = process.env.NODE_ENV === "test" ? 0 : 4000;
  return app.listen(port, () => {
    console.log("Server is running on port", port);
  });
};
