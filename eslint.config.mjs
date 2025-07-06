import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 12,
        sourceType: "module",
    },

    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "curly": ["error", "all"],
        "brace-style": ["error", "1tbs", { "allowSingleLine": false }],
        "padding-line-between-statements": [
            "error",
            { "blankLine": "always", "prev": "*", "next": ["if", "for", "switch", "while"] },
            { "blankLine": "always", "prev": ["if", "for", "switch"], "next": "*" }
        ]
    }
}]);
