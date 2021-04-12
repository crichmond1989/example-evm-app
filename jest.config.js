module.exports = {
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.js"],
  testEnvironment: "jest-environment-node-single-context",
  testTimeout: 1_000 * 10,
};
