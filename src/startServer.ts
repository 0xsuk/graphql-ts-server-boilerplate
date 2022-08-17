import { createServer } from "@graphql-yoga/node";
import * as cors from "cors";
import "dotenv/config";
import * as express from "express";
import { redis } from "./redis";
import { confirmEmail } from "./routes/confirmEmail";
import { createTypeormConn } from "./utils/createTypeormConn";
import { genSchema } from "./utils/genSchema";
import * as session from "express-session";
import { Context } from "./graphql-utils";
import { redisSessionPrefix } from "./constants";
const RedisStore = require("connect-redis")(session);

export const startServer = async () => {
  const app = express();

  const corsOptions: cors.CorsOptions = {
    credentials: true,
    origin: process.env.FRONTEND_HOST, //Becareful!: * prevent axios from storing cookie in testing
  };
  const sessionOptions: session.SessionOptions = {
    store: new RedisStore({ client: redis, prefix: redisSessionPrefix }),
    name: "qid",
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };
  const graphQLServer = createServer<{ req: express.Request }>({
    schema: genSchema(),
    context: ({ req }): Context => {
      return {
        redis,
        url: req.protocol + "://" + req.get("host"),
        session: req.session,
        req,
      };
    },
  });

  app.use(cors(corsOptions));
  app.use(session(sessionOptions));
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
