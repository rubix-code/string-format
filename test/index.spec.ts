@Describe("Basic tests")
export class BasicTests {

	@Test("Jest is running")
	public jestIsRunning() {
		expect(true).toBe(true);
	}

}
