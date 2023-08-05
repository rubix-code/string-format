import { Class } from "type-fest"
import { Assert } from "@/util/assert-util"

/**
 * String format parameters
 */
export type StringFormatParam = { [K in string]: string } | number | string | boolean | object | undefined | null

/**
 * String Transformer Function type
 *
 * @param {any} input the param on which the transformation is to be performed
 * @param {string[]} param the parameters for the transformation
 */
export type TStringTransformer = (input: any, param?: string[]) => any

/**
 * The function supports String Format parameters
 */
export type TStringFormatFunction = (...param: StringFormatParam[]) => string

/**
 * The class supports ".format" method
 *
 * @usage
 * ```typescript
 * class MyClass {
 * // .format relies on the "toString" method to get the template string
 * 	public toString() {
 * 		return "MyClass %s"
 * 	}
 * }
 * // Explicitly extend the class using interface
 * // makes the class type-safe
 * interface MyClass extends IFormattable {}
 * ...
 * // Add the functionality to the class
 * stringFormat.extend(MyClass)
 * ...
 * const myClass = new MyClass()
 * const myClassString = myClass.format("hello")
 * ```
 */
export interface IFormattable {
	format: TStringFormatFunction
}

/**
 * Formatter for string
 */
export interface IStringFormatter {

	/**
	 * Formatter Name
	 *
	 * @type {string}
	 */
	get name(): string

	/**
	 * Allows to check if adding/removing of format parser is supported
	 *
	 * @returns {boolean}
	 */
	isFormatParserSupported(identifier: string): boolean

	/**
	 * Add a new format parser to the format parser list
	 *
	 * @param {IStringFormatParser} formatParser Format Parser
	 */
	addFormatParser(formatParser: IStringFormatParser): void

	/**
	 * Check if the format parser is available
	 *
	 * @param {string} identifier Format Parser Identifier
	 * @returns {boolean} true if the format parser is available
	 */
	hasFormatParser(identifier: string): boolean

	/**
	 * Remove a format parser from the format parser list
	 *
	 * @param {string} formatParserName Format Parser Name
	 */
	removeFormatParser(formatParserName: string): void

	/**
	 * Checks if the transformers feature is supported by the formatter
	 *
	 * @returns {boolean}
	 */
	isTransformersSupported(): boolean

	/**
	 * Add a transformer to the transformer list
	 *
	 * @param {string} key the transformer key
	 * @param {TStringTransformer} transformer Transformer
	 */
	addTransformer(key: string, transformer: TStringTransformer): void

	/**
	 * Check if the transformer is available
	 *
	 * @param {string} key the transformer key
	 * @returns {boolean}
	 */
	hasTransformer(key: string): boolean

	/**
	 * Remove a transformer from the transformer list
	 *
	 * @param {string} key the transformer key
	 */
	removeTransformer(key: string): void

	/**
	 * Format a string
	 *
	 * The first return value is the boolean value indicating if the string was formatted
	 * The second return value is the formatted string
	 *
	 * @param {string} input the input string
	 * @param {any[]} param the parameters
	 * @returns {[boolean, string]} is processed, the formatted string
	 */
	format(input: string, ...param: any[]): [boolean, string]

}

/**
 * String format parser interface
 * A string format parser is used by the StringFormatter class to parse a string format string
 */
export interface IStringFormatParser {
	/**
	 * Name of the formatter
	 */
	name: string,
	/**
	 * Regex to match the formatter
	 */
	testRegex: RegExp,
	/**
	 * Function to format the string
	 * @param identifier the identifier of the formatter
	 * @param line string to format
	 * @param params parameters to format
	 * @returns formatted string
	 */
	formatter(identifier: string, line: string, param: StringFormatParam): string,
}

/**
 * String Format class.
 *
 * The functionality supports python-style string formatting, and C-style string formatting.
 *
 * @class StringFormat
 * @author RubixCode
 * @since 0.1.0
 */
export class StringFormat {

	/**
	 * set of formatters which can be added or removed
	 */
	private formatters: Map<string, IStringFormatter> = new Map()

	/**
	 * use multiple formatters
	 */
	private multipleFormatterMode: boolean = false

	/**
	 * Enable Multiple Formatter mode.
	 * This will cause the string to be formatted by all the string formatters.
	 */
	public enableMultipleFormatterMode(): void {
		this.multipleFormatterMode = true
	}

	/**
	 * Disable Multiple Formatter mode.
	 * This will cause the string to be formatted by the first string formatter that can parse it.
	 * If no formatter can parse the string, the string will be returned as is.
	 */
	public disableMultipleFormatterMode(): void {
		this.multipleFormatterMode = false
	}

	/**
	 * is multiple formatter enabled
	 */
	public isMultipleFormatterModeEnabled(): boolean {
		return this.multipleFormatterMode
	}

	/**
	 * Add a formatter to the set of formatters.
	 *
	 * @param {IStringFormatter} formatter the formatter
	 * @since 0.1.0
	 */
	public addFormatter(formatter: IStringFormatter): this {
		const identifier = formatter.name
		if (this.formatters.has(identifier)) {
			throw new Error(`Formatter ${identifier} already exists`)
		}
		this.formatters.set(identifier, formatter)
		return this
	}

	/**
	 * Check if the formatter exists
	 *
	 * @param {string} identifier the formatter name
	 * @returns {boolean} true if the formatter exists
	 * @since 0.1.0
	 */
	public hasFormatter(identifier: string): boolean {
		return this.formatters.has(identifier)
	}

	/**
	 * Remove a formatter from the set of formatters.
	 *
	 * @param {string} identifier the identifier of the formatter
	 * @since 0.1.0
	 */
	public removeFormatter(identifier: string): void {
		Assert.isString("identifier", identifier)
		if (!this.formatters.has(identifier)) {
			throw new Error(`Formatter '${identifier}' does not exist`)
		}
		// remove the formatter from the set
		this.formatters.delete(identifier)
	}

	constructor() { }

	/**
	 * Adds ".format" function to the object.
	 * @param {Class} obj Object
	 */
	public extend(obj: Class) {
		const self = this
		// register prototype method
		obj.prototype.format = function (this: any, ...args: any[]): string {
			return self.stringFormat(this.toString(), ...args)
		}
	}

	/**
	 * Format a string
	 *
	 * @param {string} input the input string
	 * @param {any[]} param the parameters
	 * @returns the formatted string
	 */
	public format(input: string, ...param: any[]): string {
		return this.stringFormat(input, ...param)
	}

	/**
	 * Format a string.
	 *
	 * @param {string} line the line to format
	 * @param {any[]} params the parameters to format the line with
	 * @returns the formatted line
	 */
	private stringFormat(line: string, ...params: StringFormatParam[]): string {
		let result = line
		// iterate over the formatters
		for (const formatter of this.formatters.values()) {
			// try to format the line
			const [isFormatted, formattedLine,] = formatter.format(result, ...params)
			if (isFormatted) {
				result = formattedLine
				if (!this.multipleFormatterMode) {
					break
				}
			}
		}
		return result
	}
}
