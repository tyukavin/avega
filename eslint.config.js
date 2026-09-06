const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    {
        ignores: ["build/**", ".cache/**", "node_modules/**"],
    },
    js.configs.recommended,
    {
        files: ["gulpfile.js", "tasks/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            globals: globals.node,
            sourceType: "commonjs",
        },
    },
    {
        files: ["src/js/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            globals: globals.browser,
            sourceType: "module",
        },
    },
];
