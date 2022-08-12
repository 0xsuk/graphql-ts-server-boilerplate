import { AppDataSource, TestDataSource } from "../data-source";

export const createTypeormConn = () => {
  console.log("creating typeorm connection");
  const env = process.env.NODE_ENV;
  if (env === "development") {
    return AppDataSource.initialize();
  }
  if (env === "test") {
    return TestDataSource.initialize();
  }

  console.warn("NODE_ENV is not set. Selecting development mode automatically");
  return AppDataSource.initialize();
};
