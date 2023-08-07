import CStyleFormatter from "@/formatters/CStyleFormatter"
import { DummyFormatParser, onlyFormatter } from "../helper"


@Describe("formatter/CStyleFormatter")
export class CStyleFormatterTest {
	protected readonly formatter = new CStyleFormatter()
	protected readonly stringFormatter = onlyFormatter(this.formatter)

	@Test("name is CStyleFormatter")
	public name() {
		expect(this.formatter.name).toBe("CStyleFormatter")
	}
}

@Describe("formatter/CStyleFormatter basic")
export class CStyleFormatterBasicTest extends CStyleFormatterTest {

	@Test("isFormatParserSupported is true")
	public isFormatParserSupported() {
		expect(this.formatter.isFormatParserSupported()).toBe(true)
	}

	@Test("Adding Format parser does not throw")
	public addFormatParser() {
		expect(() => {
			this.formatter.addFormatParser(DummyFormatParser)
		}).not.toThrow()
	}

	@Test("Adding Format parser throws if parser already exists")
	public addFormatParserThrows() {
		expect(() => {
			this.formatter.addFormatParser(DummyFormatParser)
			this.formatter.addFormatParser(DummyFormatParser)
		}).toThrow()
	}

	@Test("Removing a parser must not throw")
	public removeFormatParser() {

		// lets just add it safely just to be sure
		try {
			this.formatter.addFormatParser(DummyFormatParser)
		} catch {
			// Okay, we had it already
		}

		expect(() => {
			this.formatter.removeFormatParser(DummyFormatParser.name)
		}).not.toThrow()
	}

	@Test("Removing a parser must throw if parser does not exist")
	public removeFormatParserThrows() {
		expect(() => {
			this.formatter.removeFormatParser("some-random-parser")
		}).toThrow()
	}

	@Test("isTransformersSupported must be false")
	public isTransformersSupported() {
		expect(this.formatter.isTransformersSupported()).toBe(false)
	}

	@Test("addTransformer must throw")
	public addTransformer() {
		expect(() => {
			this.formatter.addTransformer("json", (input) => input)
		}).toThrow()
	}

	@Test("removeTransformer must throw")
	public removeTransformer() {
		expect(() => {
			this.formatter.removeTransformer("json")
		}).toThrow()
	}

	@Test("format must return false and the input string if not formatted")
	public formatNotFormatted() {
		const result = this.formatter.format("Hello World")
		expect(result[0]).toBe(false)
		expect(result[1]).toBe("Hello World")
	}

	@Test("format must return true and the formatted string if formatted")
	public formatFormatted() {
		const result = this.formatter.format("The answer to all the questions is %d", 42)
		expect(result[0]).toBe(true)
		expect(result[1]).toBe("The answer to all the questions is 42")
	}

	@Test(`custom format parser is called`)
	public customFormatParser() {
		const dummyFormatFn = jest.fn((identifier, line, param) => line.replace("%T", param))
		DummyFormatParser.formatter = dummyFormatFn
		try {
			this.formatter.addFormatParser(DummyFormatParser)
		} catch (error) {

		}

		const str = "Dummy Format - %T"
		expect(this.formatter.format(str, 42)).toEqual([true, "Dummy Format - 42",])
		expect(dummyFormatFn).toHaveBeenCalledTimes(1)

		const str2 = "Dummy Format - %T %T"
		expect(this.formatter.format(str2, 42, "life")).toEqual([true, "Dummy Format - 42 life",])
		expect(dummyFormatFn).toHaveBeenCalledTimes(3) // total of 3 times, 1 from before and 2 from now
	}

	@Test(`hasFormatParser() works`)
	public hasFormatParser() {
		try {
			this.formatter.addFormatParser(DummyFormatParser)
		} catch (error) {

		}

		let hasDummyParser
		expect(() => {
			hasDummyParser = this.formatter.hasFormatParser(DummyFormatParser.name)
		}).not.toThrow()
		expect(hasDummyParser).toBe(true)

		this.formatter.removeFormatParser(DummyFormatParser.name)

		expect(() => {
			hasDummyParser = this.formatter.hasFormatParser(DummyFormatParser.name)
		}).not.toThrow()
		expect(hasDummyParser).toBe(false)
	}

	@Test(`hasTransformer() throws as it is not supported`)
	public hasTransformer() {
		expect(() => {
			this.formatter.hasTransformer("json")
		}).toThrow()
	}
}

@Describe("formatter/CStyleFormatter String.format")
export class CStyleFormatterStringFormatTest extends CStyleFormatterTest {
	@Test(`Unmatched pattern is not replaced`)
	public defaultTest1() {
		expect("100%".format(10)).toEqual("100%")
		expect("not matched".format()).toEqual("not matched")
	}
}

@Describe("formatter/CStyleFormatter String.format with int-parser")
export class CStyleFormatterStringFormatIntParserTest extends CStyleFormatterStringFormatTest {

	@Test(`String Replace`)
	public replace() {
		expect("%d".format(10)).toEqual("10")
		expect("%d".format("10")).toEqual("10")
		expect("%d, %d".format(5, 10)).toEqual("5, 10")
		expect("%d, %d and %d".format(5, 10, 15)).toEqual("5, 10 and 15")
	}

	@Test(`Left Padding with zero`)
	public leftPaddingWithZero() {
		expect("%05d".format(123)).toEqual("00123")
		expect("%05d".format("123")).toEqual("00123")
		expect("%010d".format("123")).toEqual("0000000123")
		expect("%03d, %05d".format(1, 123)).toEqual("001, 00123")
	}

	@Test(`Left Padding with space`)
	public leftPaddingWithSpace() {
		expect("[%5d]".format(123)).toEqual("[  123]")
		expect("[%5d]".format(1234567)).toEqual("[34567]")
		expect("[%5d]".format("123")).toEqual("[  123]")
		expect("[%10d]".format(123)).toEqual("[       123]")
	}

	@Test(`Right Padding with space`)
	public rightPaddingWithSpace() {
		expect("[%-5d]".format(123)).toEqual("[123  ]")
		expect("[%-5d]".format("123")).toEqual("[123  ]")
		expect("[%-10d]".format(123)).toEqual("[123       ]")
	}

	@Test(`Unmatched padding pattern is not replaced`)
	public unmatchedPaddingPattern() {
		expect("%vd".format(123)).toEqual("%vd")
		expect("%-d".format(123)).toEqual("%-d")
	}

	@Test(`Type mismatch throws TypeError`)
	public typeMismatch() {
		expect(function () { "%d".format("test") }).toThrow(TypeError)
		expect(function () { "%05d".format("test") }).toThrow(TypeError)
		expect(function () { "[%5d]".format("test") }).toThrow(TypeError)
		expect(function () { "[%-5d]".format("test") }).toThrow(TypeError)
	}
}

@Describe("formatter/CStyleFormatter String.format with string-parser")
export class CStyleFormatterStringFormatStringParserTest extends CStyleFormatterStringFormatTest {

	@Test(`Invalid format input throws TypeError`)
	public invalidFormatInput() {
		const formatter = this.formatter;
		expect(function () { "[%5s]".format(formatter) }).toThrow(TypeError)
		expect(function () { "[%s]".format(formatter) }).toThrow(TypeError)
		expect(function () { "[%5.4s]".format(formatter) }).toThrow(TypeError)
	}

	@Test(`String Replace`)
	public replace() {
		expect("This is a %s".format("pen")).toEqual("This is a pen")
		expect("This is %s %s".format("a", "pen")).toEqual("This is a pen")
		expect("This %s %s %s".format("is", "a", "pen")).toEqual("This is a pen")
	}

	@Test(`String Padding`)
	public padding() {
		expect("[%5s]".format("abc")).toEqual("[  abc]")
		expect("[%5s]".format("abcdef")).toEqual("[bcdef]")
		expect("[%12s]".format("abc")).toEqual("[         abc]")
		expect("[%-5s]".format("abc")).toEqual("[abc  ]")
		expect("[%-12s]".format("abc")).toEqual("[abc         ]")
	}

	@Test(`String Truncation`)
	public truncation() {
		expect("[%.4s]".format("abcde")).toEqual("[abcd]")
		expect("[%.12s]".format("abcdefghijkl")).toEqual("[abcdefghijkl]")
	}

	@Test(`String truncation and padding`)
	public truncationAndPadding() {
		expect("[%5.4s]".format("abcde")).toEqual("[ abcd]")
		expect("[%12.10s]".format("abcdefghijklmnopq")).toEqual("[  abcdefghij]")
		expect("[%-5.4s]".format("abcde")).toEqual("[abcd ]")
		expect("[%-12.10s]".format("abcdefghijklmnopq")).toEqual("[abcdefghij  ]")
		expect("[%-5.4s]".format("あいうえお")).toEqual("[あいうえ ]")
	}

	@Test(`Boolean to string`)
	public booleanInput() {
		expect("%s".format(true)).toEqual("true")
		expect("%s".format("true")).toEqual("true")
		expect("%s".format(false)).toEqual("false")
		expect("%s".format("false")).toEqual("false")
	}

	@Test(`Special Characters`)
	public specialCharacters() {
		expect("%s".format("$$")).toEqual("$$")
		expect("%s".format("$$$$")).toEqual("$$$$")
		expect("%s".format("$&")).toEqual("$&")
		expect("%s".format("$`")).toEqual("$`")
		expect("%s".format("$'")).toEqual("$'")
		expect("[%5s]".format("$$")).toEqual("[   $$]")
		expect("[%-5s]".format("$$")).toEqual("[$$   ]")
		expect("[%.5s]".format("abc$$fg")).toEqual("[abc$$]")
		expect("[%.4s]".format("abc$")).toEqual("[abc$]")
		expect("[%5.5s]".format("abc$$fg")).toEqual("[abc$$]")
		expect("[%5.4s]".format("abc$$fg")).toEqual("[ abc$]")
		expect("[%-5.5s]".format("abc$$fg")).toEqual("[abc$$]")
		expect("[%-5.4s]".format("abc$$fg")).toEqual("[abc$ ]")
	}
}

@Describe("formatter/CStyleFormatter String.format with octet-parser")
export class CStyleFormatterOctetFormatStringParserTest extends CStyleFormatterStringFormatTest {

	@Test(`Invalid input throws TypeError`)
	public invalidFormatInput() {
		expect(function () { "%o".format("test") }).toThrow(TypeError)
	}

	@Test(`Replace`)
	public replace() {
		expect("%o".format(123)).toEqual("173")
		expect("%o".format("123")).toEqual("173")
		expect("%o, %o".format(5, 10)).toEqual("5, 12")
		expect("%o, %o and %o".format(5, 10, 15)).toEqual("5, 12 and 17")
		expect("0x7b => %o".format(0x7b)).toEqual("0x7b => 173")
		expect("0x7b => %o".format("0x7b")).toEqual("0x7b => 173")
	}
}

@Describe("formatter/CStyleFormatter String.format with binary-parser")
export class CStyleFormatterBinaryFormatStringParserTest extends CStyleFormatterStringFormatTest {

	@Test(`Invalid input throws TypeError`)
	public invalidFormatInput() {
		expect(function () { "%b".format("test") }).toThrow(TypeError)
	}

	@Test(`Replace`)
	public replace() {
		expect("123 => %b".format(123)).toEqual("123 => 1111011")
		expect("123 => %b".format("123")).toEqual("123 => 1111011")
		expect("0x7b => %b".format(0x7b)).toEqual("0x7b => 1111011")
		expect("0x7b => %b".format("0x7b")).toEqual("0x7b => 1111011")
	}
}

@Describe("formatter/CStyleFormatter String.format with hex-parser")
export class CStyleFormatterHexFormatStringParserTest extends CStyleFormatterStringFormatTest {

	@Test(`Invalid input throws TypeError`)
	public invalidFormatInput() {
		expect(function () { "%x".format("test") }).toThrow(TypeError)
		expect(function () { "%X".format("test") }).toThrow(TypeError)
	}

	@Test(`Replace`)
	public replace() {
		expect("123 => %x".format(123)).toEqual("123 => 7b")
		expect("123 => %x".format("123")).toEqual("123 => 7b")
		expect("123 => %X".format(123)).toEqual("123 => 7B")
		expect("123 => %X".format("123")).toEqual("123 => 7B")
	}
}

@Describe("formatter/CStyleFormatter String.format with char-parser")
export class CStyleFormatterCharFormatStringParserTest extends CStyleFormatterStringFormatTest {

	@Test(`Invalid input throws TypeError`)
	public invalidFormatInput() {
		expect(function () { "%c".format("test") }).toThrow(TypeError)
	}

	@Test(`Replace`)
	public replace() {
		expect("%c".format(97)).toEqual("a")
		expect("%c".format("97")).toEqual("a")
		expect("%c".format(0x61)).toEqual("a")
		expect("%c".format("0x61")).toEqual("a")
	}
}

@Describe("formatter/CStyleFormatter String.format with float-parser")
export class CStyleFormatterFloatFormatStringParserTest extends CStyleFormatterStringFormatTest {

	@Test(`Invalid input throws TypeError`)
	public invalidFormatInput() {
		expect(function () { "%f".format("test") }).toThrow(TypeError)
	}

	@Test(`Replace`)
	public replace() {
		expect("%f".format(1.0)).toEqual("1.000000")
		expect("%.2f".format(-12.98765)).toEqual("-12.99")
		expect("%.2f".format(1.0)).toEqual("1.00")
	}

	@Test(`Padding`)
	public padding() {
		expect("[%10f]".format(1.0)).toEqual("[1.00000000]")
		expect("[%10.2f]".format(1.0)).toEqual("[      1.00]")
		expect("[%10.2f]".format(1.2345)).toEqual("[      1.23]")
	}

	@Test(`truncate`)
	public truncate() {
		expect("[%-10.2f]".format(1.0)).toEqual("[1.00      ]")
	}
}

@Describe("formatter/CStyleFormatter String.format with exponent-parser")
export class CStyleFormatterExponentFormatStringParserTest extends CStyleFormatterStringFormatTest {

	@Test(`Invalid input throws TypeError`)
	public invalidFormatInput() {
		expect(function () { "%e".format("test") }).toThrow(TypeError)
	}

	@Test(`Incorrect input throws RangeError`)
	public incorrectInput() {
		expect(function () { "[%-1.1e]".format(9999.999) }).toThrow(RangeError)
	}

	@Test(`Replace`)
	public replace() {
		expect("%e".format(123)).toEqual("1.23e+2")
		expect("%e".format(123.45)).toEqual("1.2345e+2")
		expect("%.5e".format(123.45)).toEqual("1.23450e+2")
		expect("[%15e]".format(123.45)).toEqual("[1.2345000000e+2]")
		expect("[%15e]".format(12345678901.45)).toEqual("[1.234567890e+10]")
		expect("[%20e]".format(12345678901.45)).toEqual("[1.23456789014500e+10]")
		expect("[%15.2e]".format(123.45)).toEqual("[        1.23e+2]")
		expect("[%7.2e]".format(123.45)).toEqual("[1.23e+2]")
		expect("[%-15.2e]".format(123.45)).toEqual("[1.23e+2        ]")
	}
}
