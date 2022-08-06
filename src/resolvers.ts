import * as bcrypt from "bcryptjs";
import { User } from "./entity/User";
import { ResolverMap } from "./graphql-utils";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_, { name }: GQL.IHelloOnQueryArguments) =>
      `Bye ${name || "World"}`,
  },

  Mutation: {
    register: async (
      _,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      console.log(email, password);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword,
      });

      await user.save();
      return true;
    },
  },
};