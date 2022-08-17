import { GraphQLMiddlwareFunc } from "../../graphql-utils";

const middleware: GraphQLMiddlwareFunc = async (
  resolver,
  parent,
  args,
  context,
  info
) => {
  //check if user is logged in
  if (!context.session || !context.session.userId) {
    return null;
  }
  //middleware
  return resolver(parent, args, context, info);
  //after middleware
};

export default middleware;
