import PyStyleFormatter from "@/formatters/PyStyleFormatter"
import { DummyFormatParser, onlyFormatter } from "../helper"


@Describe("formatter/PyStyleFormatter")
export class PyStyleFormatterTest {
	protected readonly formatter = new PyStyleFormatter()
	protected readonly stringFormatter = onlyFormatter(this.formatter)

	@Test("name is PyStyleFormatter")
	public name() {
		expect(this.formatter.name).toBe("PyStyleFormatter")
	}
}

@Describe("formatter/PyStyleFormatter basic")
export class PyStyleFormatterBasicTest extends PyStyleFormatterTest {
	@Test(`isFormatParserSupported is false`)
	public isFormatParserSupported() {
		expect(this.formatter.isFormatParserSupported()).toBe(false)
	}

	@Test(`addFormatParser throws error`)
	public addFormatParserThrowsError() {
		expect(() => {
			this.formatter.addFormatParser(DummyFormatParser)
		}).toThrowError()
	}

	@Test(`hasFormatParser throws error`)
	public hasFormatParserThrowsError() {
		expect(() => {
			this.formatter.hasFormatParser(DummyFormatParser.name)
		}).toThrowError()
	}

	@Test(`removeFormatParser throws error`)
	public removeFormatParserThrowsError() {
		expect(() => {
			this.formatter.removeFormatParser("dummy")
		}).toThrowError()
	}

	@Test(`isTransformersSupported must be true`)
	public isTransformersSupported() {
		expect(this.formatter.isTransformersSupported()).toBe(true)
	}

	@Test(`addTransformer adds a transformer`)
	public addTransformerAddsTransformer() {
		const key = "test"
		const transformer = (input: string) => input
		this.formatter.addTransformer(key, transformer)
		expect(this.formatter.hasTransformer(key)).toBeTrue()
	}

	@Test(`addTransformer throws when same name is used`)
	public addTransformerThrowsWhenSameNameIsUsed() {
		const key = "test"
		const transformer = (input: string) => input
		const transformer2 = (input: string) => input + "2"
		if (!this.formatter.hasTransformer(key)) {
			this.formatter.addTransformer(key, transformer)
		}
		expect(() => {
			this.formatter.addTransformer(key, transformer2)
		}).toThrowError()
	}

	@Test(`removeTransformer deletes the transformer`)
	public removeTransformerDeletesTheTransformer() {
		const key = "test"
		const transformer = (input: string) => input
		if (!this.formatter.hasTransformer(key)) {
			this.formatter.addTransformer(key, transformer)
		}
		this.formatter.removeTransformer(key)
		expect(this.formatter.hasTransformer(key)).toBeFalse()
	}

	@Test(`removeTransformer throws if the transformer does not exist`)
	public removeTransformerThrowsIfTheTransformerDoesNotExist() {
		expect(() => {
			this.formatter.removeTransformer("dummy")
		}).toThrowError()
		expect(this.formatter.hasTransformer("dummy")).toBeFalse()
	}

	@Test(`format must return false and the input string if not formatted`)
	public formatMustReturnFalseAndTheInputStringIfNotFormatted() {
		const result = this.formatter.format("Hello World")
		expect(result[0]).toBe(false)
		expect(result[1]).toBe("Hello World")
	}

	@Test(`format must return true and the formatted string if formatted`)
	public formatMustReturnTrueAndTheFormattedStringIfFormatted() {
		// test implicit indexing
		let result = this.formatter.format("The answer to all the questions is {}", 42)
		expect(result[0]).toBe(true)
		expect(result[1]).toBe("The answer to all the questions is 42")

		// test explicit indexing
		result = this.formatter.format("The answer to all the questions is {0}", 42)
		expect(result[0]).toBe(true)
		expect(result[1]).toBe("The answer to all the questions is 42")
	}

	@Test(`custom transformer is called`)
	public customTransformerIsCalled() {
		// if the input is 69, append a " (nice!)" and return
		const theLawTransformer = (input: number) => (input === 69 ? input + " (nice!)" : input)
		this.formatter.addTransformer("theLaw", theLawTransformer)

		let inputString = "Todays lucky numbers are {|theLaw}, {|theLaw}, and {|theLaw}."
		let result = this.formatter.format(inputString, 42, 69, 9)
		expect(result[0]).toBe(true)
		expect(result[1]).toBe("Todays lucky numbers are 42, 69 (nice!), and 9.")
	}

	@Test(`throws error when transformer is not found`)
	public throwsErrorWhenTransformerIsNotFound() {
		expect(() => {
			this.formatter.format("{|dummy}")
		}).toThrowError()
	}
}

@Describe("formatter/PyStyleFormatter format")
export class PyStyleFormatterFormatTest {
	@Test("throws when indexing switches from implicit to explicit")
	public throwsWhenIndexingSwitchesFromImplicitToExplicit() {
		expect(() => {
			"The {} to all the questions is {1}".format("answer", 42)
		}).toThrowError()
	}

	@Test("throws when indexing switches from explicit to implicit")
	public throwsWhenIndexingSwitchesFromExplicitToImplicit() {
		expect(() => {
			"The {0} to all the questions is {}".format("answer", 42)
		}).toThrowError()
	}

	@Test("interpolates positional arguments")
	public interpolatesPositionalArguments() {
		expect("{0}, you have {1} unread message{2}".format("Holly", 2, "s"))
			.toBe("Holly, you have 2 unread messages")
	}

	@Test("strips unmatched placeholders")
	public stripsUnmatchedPlaceholders() {
		expect("{0}, you have {1} unread message{2}".format("Steve", 1))
			.toBe("Steve, you have 1 unread message")
	}

	@Test("allows indexes to be omitted if they are entirely sequential")
	public allowsIndexesToBeOmittedIfTheyAreEntirelySequential() {
		expect("{}, you have {} unread message{}".format("Steve", 1))
			.toBe("Steve, you have 1 unread message")
	}

	@Test("replaces all occurrences of a placeholder")
	public replacesAllOccurrencesOfAPlaceholder() {
		expect("the meaning of life is {0} ({1} x {2} is also {0})".format(42, 6, 7))
			.toBe("the meaning of life is 42 (6 x 7 is also 42)")
	}

	@Test("uses default string representations")
	public usesDefaultStringRepresentations() {
		expect("result: {}".format(null)).toBe("result: null")
		expect("result: {}".format(undefined)).toBe("result: undefined")
		expect("result: {}".format([1, 2, 3,])).toBe("result: 1,2,3")
		expect("result: {}".format({ foo: 42, })).toBe("result: [object Object]")
	}

	@Test("treats \"{{\" and \"}}\" as \"{\" and \"}\"")
	public treatsDoubleBracesAsSingleBraces() {
		expect("{{ {}: \"{}\" }}".format("foo", "bar")).toBe("{ foo: \"bar\" }")
	}

	@Test("supports property access via dot notation")
	public supportsPropertyAccessViaDotNotation() {
		let bobby = { first: "Bobby", last: "Fischer", }
		let garry = { first: "Garry", last: "Kasparov", }
		expect("{0.first} {0.last} vs. {1.first} {1.last}".format(bobby, garry))
			.toBe("Bobby Fischer vs. Garry Kasparov")
	}

	@Test("defaults to \"\" if lookup fails")
	public defaultsToEmptyStringIfLookupFails() {
		expect("result: {foo.bar.baz}".format(null))
			.toBe("result: ")

		expect("result: {foo.bar.baz}".format("x"))
			.toBe("result: ")

		expect("result: {foo.bar.baz}".format({}))
			.toBe("result: ")

		expect("result: {foo.bar.baz}".format({ foo: null, }))
			.toBe("result: ")

		expect("result: {foo.bar.baz}".format({ foo: "x", }))
			.toBe("result: ")

		expect("result: {foo.bar.baz}".format({ foo: {}, }))
			.toBe("result: ")

		expect("result: {foo.bar.baz}".format({ foo: { bar: null, }, }))
			.toBe("result: ")

		expect("result: {foo.bar.baz}".format({ foo: { bar: "x", }, }))
			.toBe("result: ")

		expect("result: {foo.bar.baz}".format({ foo: { bar: {}, }, }))
			.toBe("result: ")

		expect("result: {foo.bar.baz}".format({ foo: { bar: { baz: null, }, }, }))
			.toBe("result: null")

		expect("result: {foo.bar.baz}".format({ foo: { bar: { baz: "x", }, }, }))
			.toBe("result: x")

		expect("result: {foo.bar.baz}".format({ foo: { bar: { baz: {}, }, }, }))
			.toBe("result: [object Object]")

	}

	@Test("invokes methods")
	public invokesMethods() {
		expect("{0.toLowerCase}".format("III")).toBe("iii")
		expect("{0.toUpperCase}".format("iii")).toBe("III")
		expect("{0.getFullYear}".format(new Date("26 Apr 1984"))).toBe("1984")
		expect("{pop}-{pop}-{pop}".format(["one", "two", "three",])).toBe("three-two-one")
		expect("{quip.toUpperCase}".format({ quip: function () { return "Bazinga!" }, })).toBe("BAZINGA!")
	}

	@Test("passes applicable tests from Python's test suite")
	public passesApplicableTestsFromPythonsTestSuite() {
		expect("".format()).toBe("")
		expect("abc".format()).toBe("abc")
		expect("{0}".format("abc")).toBe("abc")
		expect("X{0}".format("abc")).toBe("Xabc")
		expect("{0}X".format("abc")).toBe("abcX")
		expect("X{0}Y".format("abc")).toBe("XabcY")
		expect("{1}".format(1, "abc")).toBe("abc")
		expect("X{1}".format(1, "abc")).toBe("Xabc")
		expect("{1}X".format(1, "abc")).toBe("abcX")
		expect("X{1}Y".format(1, "abc")).toBe("XabcY")
		expect("{0}".format(-15)).toBe("-15")
		expect("{0}{1}".format(-15, "abc")).toBe("-15abc")
		expect("{0}X{1}".format(-15, "abc")).toBe("-15Xabc")
		expect("{{".format()).toBe("{")
		expect("}}".format()).toBe("}")
		expect("{{}}".format()).toBe("{}")
		expect("{{x}}".format()).toBe("{x}")
		expect("{{{0}}}".format(123)).toBe("{123}")
		expect("{{{{0}}}}".format()).toBe("{{0}}")
		expect("}}{{".format()).toBe("}{")
		expect("}}x{{".format()).toBe("}x{")
	}

}
