import { Request } from "express";
import * as session from "express-session";
import { GraphQLResolveInfo } from "graphql";
import Redis from "ioredis";
import { ResolverFn } from "./schema";

interface Session extends session.Session {
  userId?: string;
}

export interface Context {
  redis: Redis;
  baseUrl: string;
  session: Session;
  req: Request;
}

export type GraphQLMiddlwareFunc = (
  resolver: ResolverFn<{}, {}, Context, GraphQLResolveInfo>,
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;
