module.exports = {
  env: {
    browser: true,
    node: true
  },
  extends: [
    "eslint:recommended"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    "array-bracket-newline": [
      "error",
      "consistent"
    ],
    "array-bracket-spacing": [
      "error",
      "always",
      {
        arraysInArrays: false,
        objectsInArrays: false,
        singleValue: true
      }
    ],
    "arrow-parens": [
      "error",
      "always"
    ],
    "brace-style": [
      "error",
      "stroustrup"
    ],
    "comma-dangle": [
      "error",
      "never"
    ],
    "comma-spacing": [
      "error",
      {
        after: true,
        before: false
      }
    ],
    "computed-property-spacing": [
      "error",
      "never"
    ],
    curly: [
      "error"
    ],
    "dot-location": [
      "error",
      "property"
    ],
    "eol-last": [
      "error",
      "always"
    ],
    indent: [
      "error",
      2
    ],
    "key-spacing": [
      "error",
      {
        mode: "strict"
      }
    ],
    "keyword-spacing": [
      "error",
      {
        after: false,
        overrides: {
          catch: {
            after: true
          },
          const: {
            after: true
          },
          constructor: {
            after: true
          },
          else: {
            after: true
          },
          from: {
            after: true
          },
          if: {
            after: true
          },
          import: {
            after: true
          },
          return: {
            after: true
          },
          throw: {
            after: true
          },
          try: {
            after: true
          }
        }
      }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "max-len": [
      "error",
      {
        code: 100
      }
    ],
    "multiline-ternary": [
      "error",
      "always-multiline"
    ],
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1
      }
    ],
    "no-unused-vars": [
      "error",
      {
        args: "after-used",
        ignoreRestSiblings: false,
        vars: "all"
      }
    ],
    "no-whitespace-before-property": "error",
    "nonblock-statement-body-position": [
      "error",
      "below"
    ],
    "object-curly-newline": [
      "error",
      {
        ObjectExpression: "always",
        ObjectPattern: "never"
      }
    ],
    "object-curly-spacing": [
      "error",
      "always",
      {
        objectsInObjects: true
      }
    ],
    "padded-blocks": [
      "error",
      "never"
    ],
    quotes: [
      "error",
      "double"
    ],
    radix: "off",
    semi: [
      "error",
      "always"
    ],
    "space-before-function-paren": [
      "error", {
        "anonymous": "always",
        "named": "always",
        "asyncArrow": "always"
      }
    ],
    "space-in-parens": [
      "error",
      "always",
      {
        exceptions: [
          "empty",
          "{}",
          "()"
        ]
      }
    ],
    "space-infix-ops": "error",
    "switch-colon-spacing": [
      "error",
      {
        after: true,
        before: false
      }
    ],
    yoda: "error"
  }
};
