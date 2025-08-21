module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./", // This sets up @/ to point to app/
          },
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      ],
    ],
  };
};
