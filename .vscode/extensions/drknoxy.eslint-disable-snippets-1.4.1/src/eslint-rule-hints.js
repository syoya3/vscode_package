const rules = [
  "array-callback-return",
  "constructor-super",
  "for-direction",
  "getter-return",
  "no-async-promise-executor",
  "no-await-in-loop",
  "no-class-assign",
  "no-compare-neg-zero",
  "no-cond-assign",
  "no-const-assign",
  "no-constant-binary-expression",
  "no-constant-condition",
  "no-constructor-return",
  "no-control-regex",
  "no-debugger",
  "no-dupe-args",
  "no-dupe-class-members",
  "no-dupe-else-if",
  "no-dupe-keys",
  "no-duplicate-case",
  "no-duplicate-imports",
  "no-empty-character-class",
  "no-empty-pattern",
  "no-ex-assign",
  "no-fallthrough",
  "no-func-assign",
  "no-import-assign",
  "no-inner-declarations",
  "no-invalid-regexp",
  "no-irregular-whitespace",
  "no-loss-of-precision",
  "no-misleading-character-class",
  "no-new-native-nonconstructor",
  "no-new-symbol",
  "no-obj-calls",
  "no-promise-executor-return",
  "no-prototype-builtins",
  "no-self-assign",
  "no-self-compare",
  "no-setter-return",
  "no-sparse-arrays",
  "no-template-curly-in-string",
  "no-this-before-super",
  "no-undef",
  "no-unexpected-multiline",
  "no-unmodified-loop-condition",
  "no-unreachable",
  "no-unreachable-loop",
  "no-unsafe-finally",
  "no-unsafe-negation",
  "no-unsafe-optional-chaining",
  "no-unused-private-class-members",
  "no-unused-vars",
  "no-use-before-define",
  "no-useless-backreference",
  "require-atomic-updates",
  "use-isnan",
  "valid-typeof",
  "accessor-pairs",
  "arrow-body-style",
  "block-scoped-var",
  "camelcase",
  "capitalized-comments",
  "class-methods-use-this",
  "complexity",
  "consistent-return",
  "consistent-this",
  "curly",
  "default-case",
  "default-case-last",
  "default-param-last",
  "dot-notation",
  "eqeqeq",
  "func-name-matching",
  "func-names",
  "func-style",
  "grouped-accessor-pairs",
  "guard-for-in",
  "id-denylist",
  "id-length",
  "id-match",
  "init-declarations",
  "logical-assignment-operators",
  "max-classes-per-file",
  "max-depth",
  "max-lines",
  "max-lines-per-function",
  "max-nested-callbacks",
  "max-params",
  "max-statements",
  "multiline-comment-style",
  "new-cap",
  "no-alert",
  "no-array-constructor",
  "no-bitwise",
  "no-caller",
  "no-case-declarations",
  "no-confusing-arrow",
  "no-console",
  "no-continue",
  "no-delete-var",
  "no-div-regex",
  "no-else-return",
  "no-empty",
  "no-empty-function",
  "no-empty-static-block",
  "no-eq-null",
  "no-eval",
  "no-extend-native",
  "no-extra-bind",
  "no-extra-boolean-cast",
  "no-extra-label",
  "no-extra-semi",
  "no-floating-decimal",
  "no-global-assign",
  "no-implicit-coercion",
  "no-implicit-globals",
  "no-implied-eval",
  "no-inline-comments",
  "no-invalid-this",
  "no-iterator",
  "no-label-var",
  "no-labels",
  "no-lone-blocks",
  "no-lonely-if",
  "no-loop-func",
  "no-magic-numbers",
  "no-mixed-operators",
  "no-multi-assign",
  "no-multi-str",
  "no-negated-condition",
  "no-nested-ternary",
  "no-new",
  "no-new-func",
  "no-new-object",
  "no-new-wrappers",
  "no-nonoctal-decimal-escape",
  "no-octal",
  "no-octal-escape",
  "no-param-reassign",
  "no-plusplus",
  "no-proto",
  "no-redeclare",
  "no-regex-spaces",
  "no-restricted-exports",
  "no-restricted-globals",
  "no-restricted-imports",
  "no-restricted-properties",
  "no-restricted-syntax",
  "no-return-assign",
  "no-return-await",
  "no-script-url",
  "no-sequences",
  "no-shadow",
  "no-shadow-restricted-names",
  "no-ternary",
  "no-throw-literal",
  "no-undef-init",
  "no-undefined",
  "no-underscore-dangle",
  "no-unneeded-ternary",
  "no-unused-expressions",
  "no-unused-labels",
  "no-useless-call",
  "no-useless-catch",
  "no-useless-computed-key",
  "no-useless-concat",
  "no-useless-constructor",
  "no-useless-escape",
  "no-useless-rename",
  "no-useless-return",
  "no-var",
  "no-void",
  "no-warning-comments",
  "no-with",
  "object-shorthand",
  "one-var",
  "one-var-declaration-per-line",
  "operator-assignment",
  "prefer-arrow-callback",
  "prefer-const",
  "prefer-destructuring",
  "prefer-exponentiation-operator",
  "prefer-named-capture-group",
  "prefer-numeric-literals",
  "prefer-object-has-own",
  "prefer-object-spread",
  "prefer-promise-reject-errors",
  "prefer-regex-literals",
  "prefer-rest-params",
  "prefer-spread",
  "prefer-template",
  "quote-props",
  "radix",
  "require-await",
  "require-unicode-regexp",
  "require-yield",
  "sort-imports",
  "sort-keys",
  "sort-vars",
  "spaced-comment",
  "strict",
  "symbol-description",
  "vars-on-top",
  "yoda",
  "array-bracket-newline",
  "array-bracket-spacing",
  "array-element-newline",
  "arrow-parens",
  "arrow-spacing",
  "block-spacing",
  "brace-style",
  "comma-dangle",
  "comma-spacing",
  "comma-style",
  "computed-property-spacing",
  "dot-location",
  "eol-last",
  "func-call-spacing",
  "function-call-argument-newline",
  "function-paren-newline",
  "generator-star-spacing",
  "implicit-arrow-linebreak",
  "indent",
  "jsx-quotes",
  "key-spacing",
  "keyword-spacing",
  "line-comment-position",
  "linebreak-style",
  "lines-around-comment",
  "lines-between-class-members",
  "max-len",
  "max-statements-per-line",
  "multiline-ternary",
  "new-parens",
  "newline-per-chained-call",
  "no-extra-parens",
  "no-mixed-spaces-and-tabs",
  "no-multi-spaces",
  "no-multiple-empty-lines",
  "no-tabs",
  "no-trailing-spaces",
  "no-whitespace-before-property",
  "nonblock-statement-body-position",
  "object-curly-newline",
  "object-curly-spacing",
  "object-property-newline",
  "operator-linebreak",
  "padded-blocks",
  "padding-line-between-statements",
  "quotes",
  "rest-spread-spacing",
  "semi",
  "semi-spacing",
  "semi-style",
  "space-before-blocks",
  "space-before-function-paren",
  "space-in-parens",
  "space-infix-ops",
  "space-unary-ops",
  "switch-colon-spacing",
  "template-curly-spacing",
  "template-tag-spacing",
  "unicode-bom",
  "wrap-iife",
  "wrap-regex",
  "yield-star-spacing"
];

module.exports = rules;