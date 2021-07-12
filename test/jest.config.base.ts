export default {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "../../",
  modulePaths: ["<rootDir>/"],
  clearMocks: true,
  restoreMocks: true,
  globals: {
    "ts-jest": {
      tsconfig: "test/tsconfig.json",
    },
  },
};
