import Redis from "ioredis";
import * as session from "express-session";

interface Session extends session.Session {
  userId?: string;
}

export type Resolver = (
  parent: any,
  args: any,
  context: {
    redis: Redis;
    url: string;
    session: Session;
  },
  info: any
) => any;

export type GraphQLMiddlwareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: {
    redis: Redis;
    url: string;
    session: Session;
  },
  info: any
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}
