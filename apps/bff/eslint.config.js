import { config } from "@repo/eslint-config/base";
import globals from "globals";

export default [
  ...config,
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
