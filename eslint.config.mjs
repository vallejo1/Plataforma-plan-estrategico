import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "node_modules/**",
    "next-env.d.ts",
    "*.bak",
    "test_eslint_import.mjs",
    "test_eslint_import2.mjs",
    "testPatch.js",
    "fix_routes.js",
    "fix_routes.cjs",
    "rewrite_routes.cjs",
    "check_methods.js",
    "__tests__/**",
    "_archive/**",
    "scratch/**"
  ]),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }]
    }
  }
]);
