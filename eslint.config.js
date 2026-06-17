// @ts-check

import { globalIgnores, defineConfig } from "eslint/config";
import tanstackRouter from "@tanstack/eslint-plugin-router";
import perfectionist from "eslint-plugin-perfectionist";
import prettier from "eslint-config-prettier/flat";
import reactHooks from "eslint-plugin-react-hooks";
import ts from "typescript-eslint";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  globalIgnores([
    "**/routeTree.gen.ts",
    "**/_generated/",
    "**/migrations/",
    "**/.tanstack/",
    "**/.turbo/",
    "**/dist/",
  ]),
  js.configs.recommended,
  ts.configs.recommendedTypeChecked,
  perfectionist.configs["recommended-line-length"],
  {
    rules: {
      // Allow throwing non-Error - TanStack Router's convention for not found and redirect
      "@typescript-eslint/only-throw-error": [
        "error",
        {
          allow: [
            {
              package: "@tanstack/router-core",
              name: "Redirect",
              from: "package",
            },
            {
              package: "@tanstack/router-core",
              name: "NotFoundError",
              from: "package",
            },
          ],
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      // Disable sorting with perfectionist for certain cases
      "perfectionist/sort-object-types": "off",
      "perfectionist/sort-interfaces": "off",
      "perfectionist/sort-objects": "off",
      "perfectionist/sort-classes": "off",
      "perfectionist/sort-modules": "off",
      // Turn on curly rule from @eslint/js
      curly: "error",
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.bunBuiltin,
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
      },
    },
  },
  tanstackRouter.configs["flat/recommended"],
  reactHooks.configs.flat.recommended,
  prettier,
]);
