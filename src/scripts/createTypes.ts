import { codegen } from "@graphql-codegen/core";
import * as fs from "fs";
import * as typescriptPlugin from "@graphql-codegen/typescript";
import { GraphQLSchema, parse, printSchema } from "graphql";
import { genSchema } from "../utils/genSchema";
import path = require("path");

//READ: https://www.graphql-code-generator.com/docs/advanced/programmatic-usage
(async () => {
  const schema: GraphQLSchema = genSchema();
  const outputFile = path.join(__dirname, "../types/schema2.d.ts");
  const output = await codegen({
    documents: [],
    config: {},
    // used by a plugin internally, although the 'typescript' plugin currently
    // returns the string output, rather than writing to a file
    filename: outputFile,
    schema: parse(printSchema(schema)),
    plugins: [
      // Each plugin should be an object
      {
        typescript: {}, // Here you can pass configuration to the plugin
      },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
    },
  });

  fs.writeFile(outputFile, output, () => {});
})();
