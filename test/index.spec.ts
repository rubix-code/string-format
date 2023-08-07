import formatter from "@/index"

@Describe("global string.format")
export class GlobalStringFormatTest {
	@Test("String.prototype.format exists")
	public stringPrototypeFormatExists() {
		expect(String.prototype.format).toBeDefined()
	}

	@Test(".format does not throw")
	public formatDoesNotThrow() {
		expect(() => "".format()).not.toThrow()
	}

	@Test(".format supports C-Style")
	public formatSupportsCStyle() {
		expect("%d %s %X".format(1, "test", 0xFF)).toBe("1 test FF")
	}

	@Test(".format supports Python-Style")
	public formatSupportsPythonStyle() {
		expect("{0} {1} {2}".format(1, "test", 0xFF)).toBe("1 test 255")
	}

	@Test(".format supports json transformer")
	public formatSupportsJsonTransformer() {
		expect("{0} {1} {2}".format(1, "test", { a: 1, })).toBe("1 test [object Object]")
		expect("{0} {1} {2|json}".format(1, "test", { a: 1, })).toBe("1 test {\"a\":1}")
	}

	@Test(".format support for multiple formatters is disabled by default")
	public formatSupportForMultipleFormattersIsDisabledByDefault() {
		expect(formatter.isMultipleFormatterModeEnabled()).toBeFalse()
	}

	@Test("enable multiple formatter")
	public enableMultipleFormatter() {
		formatter.enableMultipleFormatterMode()
		expect(formatter.isMultipleFormatterModeEnabled()).toBeTrue()

		// multiple formatter can allow double-formatting
		// pass %s to {} and format it
		// What happened?
		// The Python formatter added a c style template into the string
		// the c style formatter re-evaluated the string and added the param back but with the padding
		// Concern: This can be an attack vector
		// TODO: [MAPLETS-51] Evaluate the threat of allowing multiple formatters
		expect("random - [{0}]".format("%5s")).toBe("random - [  %5s]")

	}
}
