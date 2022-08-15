import { GraphQLMiddlwareFunc } from "../../graphql-utils";

const middleware: GraphQLMiddlwareFunc = async (
  resolver,
  parent,
  args,
  context,
  info
) => {
  //middleware
  const result = await resolver(parent, args, context, info);
  //after middleware

  return result;
};

export default middleware;
