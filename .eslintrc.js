module.exports = {
  env: {
    browser: true,
    "commonjs": true,
    es6: true 
  },
  extends: [ "eslint:recommended" ],
  globals: { Atomics: "readonly", SharedArrayBuffer: "readonly" },
  rules: {
    "array-bracket-newline": [ "error", "consistent" ],
    "array-bracket-spacing": [ "error", "always", { 
      "singleValue": true, 
      "objectsInArrays": false,
      "arraysInArrays": false
    }],
    "arrow-parens": [ "error", "as-needed" ],
    "brace-style": [ "error", "stroustrup" ],
    "comma-dangle": [ "error", "never" ],
    "comma-spacing": [ "error", { "before": false, "after": true }],
    "computed-property-spacing": [ "error", "never" ],
    "curly": [ "error" ],
    "dot-location": [ "error", "object" ],
    "eol-last": [ "error", "always" ],
    "indent": [ "error", 2 ],
    "linebreak-style": [ "error", "unix" ],
    "max-len": [ "error", { "code": 100 }],
    "multiline-ternary": [ "error", "always-multiline" ],
    "nonblock-statement-body-position": [ "error", "below" ],
    "no-multiple-empty-lines": [ "error", { "max": 1 }],
    "no-multi-spaces": "error",
    "no-unused-vars": [ 
      "error", 
      { 
        "vars": "all", 
        "args": "after-used", 
        "ignoreRestSiblings": false 
      } 
    ],
    "no-whitespace-before-property": "error",
    "object-curly-spacing": [ "error", "always", { "objectsInObjects": true }],
    // "object-property-newline": "error",
    "object-curly-newline": [ "error", { "minProperties": 3 }],
    "padded-blocks": [ "error", "never" ],
    "keyword-spacing": [ "error", { after: false, "overrides": { 
      "return": { "after": true }, "throw": { "after": true }, "case": { "after": true } 
    } }],
    radix: "off",
    "semi": [ "error", "always" ],
    "space-before-function-paren": [ "error", "never" ],
    "space-in-parens": [ "error", "always", { "exceptions": [ "empty", "()" ] }],
    "space-infix-ops": "error",
    "switch-colon-spacing": [ "error", { "after": true, "before": false }],
    "quotes": [ "error", "double" ],
    "key-spacing": [ "error", { "mode": "strict" }],
    yoda: "error"
  }
};
