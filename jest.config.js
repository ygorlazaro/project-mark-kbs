module.exports = {
    testEnvironment: "node",
    maxConcurrency: 20,
    testMatch: ["**/src/**/*.test.ts"],
    runner: "tsc",
    workerThreads: true
};
