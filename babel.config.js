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
            "@": "./src",
            "@features": "./src/features",
            "@providers": "./src/providers",
            "@shared": "./src/shared",
            "@assets": "./src/assets",
            "@core": "./src/core",
          },
        },
      ],
      "react-native-worklets/plugin",
    ],
  };
};
