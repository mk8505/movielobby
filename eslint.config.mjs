import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Apply rules to all JS-related files except those inside the dist folder
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], // Include all JS files
    ignores: ["dist/**"], // Explicitly exclude dist folder
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
];
