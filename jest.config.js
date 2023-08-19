/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFilesAfterEnv: [
		"jest-extended/all",
		"<rootDir>/test/jest.setup.ts"
	],
	"rootDir": "./",
	"moduleNameMapper": {
		"^@/(.*)$": "<rootDir>/src/$1"
	},
	verbose: true,
	passWithNoTests: true,
	collectCoverage: true,
	collectCoverageFrom: [
		"src/**/*.{ts,js}",
	],
	reporters: [
		"default",
		[
			"jest-html-reporters",
			{
				"publicPath": "./test-report",
				"filename": "report.html",
				"expand": true,
				darkTheme: true,
			}
		]
	],
	coverageReporters: ["json", "lcov",],
	// detectLeaks: true,
};
