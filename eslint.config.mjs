import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import playwrightPlugin from "eslint-plugin-playwright";


export default defineConfig([
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      "semi": ["error", "always"]
    }
  },
  // Playwright-specific configuration
  {
    files: ["tests/**/*.{js,ts}"],
    plugins: {
      playwright: playwrightPlugin
    },
    rules: {
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "warn",
      "playwright/prefer-to-be": "warn",
      "playwright/prefer-to-have-length": "warn",
      "playwright/valid-expect": "error"
    }
  }
]);