import { IFormattable, StringFormat } from "@/StringFormat"
import { DummyFormatter, DummyJSONTransformer } from "./helper"

@Describe("StringFormat")
export class StringFormatTest {
	@Test("constructor")
	public constructorTest() {
		let instance!: StringFormat
		expect(() => {
			instance = new StringFormat()
		}).not.toThrow()
		expect(instance).toBeInstanceOf(StringFormat)
	}

	@Test("multi formatter mode is disabled by default")
	public multiFormatterModeIsDisabledByDefault() {
		const instance = new StringFormat()
		expect(instance.isMultipleFormatterModeEnabled()).toBe(false)
	}

	@Test("enableMultipleFormatterMode() works")
	public enableMultipleFormatterMode() {
		const instance = new StringFormat()
		instance.enableMultipleFormatterMode()
		expect(instance.isMultipleFormatterModeEnabled()).toBe(true)
	}

	@Test("disableMultipleFormatterMode() works")
	public disableMultipleFormatterMode() {
		const instance = new StringFormat()
		instance.enableMultipleFormatterMode()
		instance.disableMultipleFormatterMode()
		expect(instance.isMultipleFormatterModeEnabled()).toBe(false)
	}

	@Test("addFormatter() works")
	public addFormatter() {
		const instance = new StringFormat()
		const formatter = new DummyFormatter()
		instance.addFormatter(formatter)
		expect(instance.hasFormatter(formatter.name)).toBe(true)
	}

	@Test("addFormatter() throws if formatter is already added")
	public addFormatterThrowsIfFormatterIsAlreadyAdded() {
		const instance = new StringFormat()
		const formatter = new DummyFormatter()
		instance.addFormatter(formatter)
		expect(() => {
			instance.addFormatter(formatter)
		}).toThrow()
	}

	@Test("hasFormatter() works")
	public hasFormatter() {
		const instance = new StringFormat()
		const formatter = new DummyFormatter()
		instance.addFormatter(formatter)
		expect(instance.hasFormatter(formatter.name)).toBe(true)
	}

	@Test("removeFormatter() works")
	public removeFormatter() {
		const instance = new StringFormat()
		const formatter = new DummyFormatter()
		instance.addFormatter(formatter)
		expect(instance.hasFormatter(formatter.name)).toBe(true)
		instance.removeFormatter(formatter.name)
		expect(instance.hasFormatter(formatter.name)).toBe(false)
	}

	@Test("removeFormatter() throws if formatter is not added")
	public removeFormatterThrowsIfFormatterIsNotAdded() {
		const instance = new StringFormat()
		const formatter = new DummyFormatter()
		expect(() => {
			instance.removeFormatter(formatter.name)
		}).toThrow()
	}

	@Test("extend() works")
	public extend() {
		const instance = new StringFormat()
		const formatter = new DummyFormatter()
		instance.addFormatter(formatter)

		class Temp {
			public toString() {
				return "TempObject %T|json"
			}
		}
		interface Temp extends IFormattable { }
		let x = new Temp()
		expect(x.format).toBeUndefined()

		instance.extend(Temp)
		let obj = new Temp()
		expect(obj).toHaveProperty("format")
		expect(obj.format).toBeFunction()
		expect(obj.format("test")).toBe("TempObject test")
	}

	@Test("single formatter mode stops after 1st formatter")
	public singleFormatterModeStopsAfter1stFormatter() {
		// 1st Formatter
		const cStyleFormatter = new DummyFormatter("c-style")
		cStyleFormatter.format = jest.fn((input) => [true, input,])

		// 2nd formatter
		const dummyFormatter = new DummyFormatter("only-transform")
		dummyFormatter.addTransformer("json", DummyJSONTransformer)
		let ogDummyFormatFn = dummyFormatter.format
		dummyFormatter.format = jest.fn(ogDummyFormatFn)

		const instance = new StringFormat()
		instance.addFormatter(cStyleFormatter)
		instance.addFormatter(dummyFormatter)

		const obj = { 1: 1, 2: {}, 3: [4, 5, 6,], }
		const input = "test %T|json"
		let result = instance.format(input, obj)
		expect(cStyleFormatter.format).toHaveBeenCalled()
		expect(dummyFormatter.format).not.toHaveBeenCalled()
		expect(result).toEqual(input)
	}

	@Test("single formatter mode runs till a formatter is found")
	public singleFormatterModeRunsTillAFormatterIsFound() {
		// 1st Formatter
		const cStyleFormatter = new DummyFormatter("c-style")
		cStyleFormatter.format = jest.fn((input) => [false, input,])

		// 2nd formatter
		const dummyFormatter = new DummyFormatter("only-transform")
		dummyFormatter.addTransformer("json", DummyJSONTransformer)
		let ogDummyFormatFn = dummyFormatter.format
		dummyFormatter.format = jest.fn(ogDummyFormatFn)

		const instance = new StringFormat()
		instance.addFormatter(cStyleFormatter)
		instance.addFormatter(dummyFormatter)

		const obj = { 1: 1, 2: {}, 3: [4, 5, 6,], }
		const input = "test %T|json"
		let result = instance.format(input, obj)
		expect(cStyleFormatter.format).toHaveBeenCalled()
		expect(dummyFormatter.format).toHaveBeenCalled()
		expect(result).toEqual("test " + JSON.stringify(obj))
	}

	@Test("multiple formatter mode runs till a formatter is found")
	public multipleFormatterModeRunsTillAFormatterIsFound() {
		// 1st Formatter
		const cStyleFormatter = new DummyFormatter("c-style")
		cStyleFormatter.format = jest.fn((input) => [false, input,])

		// 2nd formatter
		const dummyFormatter = new DummyFormatter("only-transform")
		dummyFormatter.addTransformer("json", DummyJSONTransformer)
		let ogDummyFormatFn = dummyFormatter.format
		dummyFormatter.format = jest.fn(ogDummyFormatFn)

		const instance = new StringFormat()
		instance.enableMultipleFormatterMode()
		instance.addFormatter(cStyleFormatter)
		instance.addFormatter(dummyFormatter)

		const obj = { 1: 1, 2: {}, 3: [4, 5, 6,], }
		const input = "test %T|json"
		let result = instance.format(input, obj)
		expect(cStyleFormatter.format).toHaveBeenCalled()
		expect(dummyFormatter.format).toHaveBeenCalled()
		expect(result).toEqual("test " + JSON.stringify(obj))
	}

	@Test("multiple formatter mode runs for all formatters")
	public multipleFormatterModeRunsForAllFormatters() {
		// 1st Formatter
		const cStyleFormatter = new DummyFormatter("c-style")
		cStyleFormatter.format = jest.fn((input) => [true, input,])

		// 2nd formatter
		const dummyFormatter = new DummyFormatter("only-transform")
		dummyFormatter.addTransformer("json", DummyJSONTransformer)
		let ogDummyFormatFn = dummyFormatter.format
		dummyFormatter.format = jest.fn(ogDummyFormatFn)

		const instance = new StringFormat()
		instance.enableMultipleFormatterMode()
		instance.addFormatter(cStyleFormatter)
		instance.addFormatter(dummyFormatter)

		const obj = { 1: 1, 2: {}, 3: [4, 5, 6,], }
		const input = "test %T|json"
		let result = instance.format(input, obj)
		expect(cStyleFormatter.format).toHaveBeenCalled()
		expect(dummyFormatter.format).toHaveBeenCalled()
		expect(result).toEqual("test " + JSON.stringify(obj))
	}
}
