import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  name: "development",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "graphql-ts-server-boilerplate",
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});

export const TestDataSource = new DataSource({
  name: "test",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "graphql-ts-server-boilerplate-test",
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});
