import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Enable auto-removal of unused imports
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      // 🔧 This one removes unused imports on --fix
      "unused-imports/no-unused-imports": "error",

      // Prefer this over the built-ins so underscore-prefix can silence warnings
      "unused-imports/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Turn off conflicting rules (Next/TS presets may enable these)
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
