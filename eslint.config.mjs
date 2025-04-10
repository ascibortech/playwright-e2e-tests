import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";


export default defineConfig([
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      "semi": ["error", "always"]
    }
  }
]);