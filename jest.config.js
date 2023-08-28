export default {
  // https://jestjs.io/docs/ecmascript-modules
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  // testEnvironment: 'node',
  testRegex: ".*.test.ts",
};
