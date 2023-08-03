/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFilesAfterEnv: [
		"<rootDir>/jest.setup.ts"
	],
	"rootDir": "./test",
	"moduleNameMapper": {
		"^@/(.*)$": "<rootDir>/../src/$1"
	},
	verbose: true,
	passWithNoTests: true,
	// detectLeaks: true,
};
