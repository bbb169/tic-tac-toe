module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
    ],
    rules: {
        // TypeScript-specific rules
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

        // React-specific rules
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-uses-vars": "error",
        "@typescript-eslint/ban-ts-comment": "warn", // 禁止使用特定类型的注释
        "@typescript-eslint/no-floating-promises": "error", // 禁止没有返回值的 Promise 链
        "@typescript-eslint/no-misused-promises": "error", // 避免 Promise 被误用
        "@typescript-eslint/no-non-null-assertion": "off", // 允许使用非空断言操作符
        "@typescript-eslint/no-var-requires": "off", // 允许 require 语句
        "@typescript-eslint/prefer-as-const": "error", // 将 let 变量声明为 const
        "@typescript-eslint/prefer-for-of": "error", // 优先使用 for...of 循环
        "@typescript-eslint/prefer-nullish-coalescing": "error", // 优先使用 ?? 运算符而不是 ||
        "@typescript-eslint/prefer-optional-chain": "error", // 优先使用可选链式调用运算符
        "@typescript-eslint/require-await": "error", // 禁止不必要的 async 函数
        "@typescript-eslint/strict-boolean-expressions": "error", // 要求在 boolean 类型的上下文中使用 !! 操作符
        "@typescript-eslint/switch-exhaustiveness-check": "error", // 检查 switch 语句是否涵盖了所有的情况
    
        // React-specific rules
        "react-hooks/exhaustive-deps": "error", // 防止漏传 useEffect 的依赖项
        "react-hooks/rules-of-hooks": "error", // 检查 React Hooks 的使用规则
        "react/jsx-curly-brace-presence": [
          "error",
          { props: "never", children: "never" },
        ], // 禁止在没有必要的情况下使用大括号
        "react/jsx-no-useless-fragment": "error", // 禁止无意义的 Fragment
        "react/no-array-index-key": "error", // 禁止在数组元素中使用 index 作为 key
        "react/no-danger": "error", // 禁止使用 dangerouslySetInnerHTML
        "react/no-unused-state": "error", // 检测未使用的 state
        "react/prop-types": "off", // 不强制使用 PropTypes
        "react/self-closing-comp": "error", // 要求没有子元素的标签使用自闭合写法
    },
}
