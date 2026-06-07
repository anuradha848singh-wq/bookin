module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "boundaries"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:boundaries/recommended",
    "prettier"
  ],
  settings: {
    "boundaries/elements": [
      {
        type: "apps",
        pattern: "apps/*"
      },
      {
        type: "packages",
        pattern: "packages/*"
      }
    ]
  },
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "boundaries/element-types": [
      "error",
      {
        default: "allow",
        rules: [
          {
            from: ["apps"],
            allow: ["packages"],
            message: "Apps can only import from packages, not other apps!"
          }
        ]
      }
    ]
  }
};
