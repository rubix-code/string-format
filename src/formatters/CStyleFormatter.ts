import { Assert } from "@/util/assert-util"
import { IStringFormatParser, StringFormatParam, IStringFormatter, TStringTransformer } from "../StringFormat"

const TypeErrors = {
	INTEGER_TYPE_ERROR(value: any) { return new TypeError(`${value} is not an integer`) },
	STRING_TYPE_ERROR(value: any) { return new TypeError(`${value} is not a string`) },
}

/**
 * function to check if string can be converted to number
 * @param value number in string
 * @returns boolean
 */
function isParsableNumber(value: string): value is string {
	let n = parseFloat(value)
	let result = !isNaN(n) && isFinite(n)
	return result
}

//#region String format parsers - C style

//%d %s - simple integer and string
const stringIntParser: IStringFormatParser = {
	name: "string-int-parser",
	testRegex: /^([ds])$/,
	formatter(identifier: string, line: string, param: StringFormatParam): string {
		if (RegExp.$1 === "d" && !isParsableNumber(<string>param)) {
			throw TypeErrors.INTEGER_TYPE_ERROR(param)
		}
		else if (RegExp.$1 === "s" && typeof param !== "string" && typeof param !== "boolean") {
			throw TypeErrors.STRING_TYPE_ERROR(param)
		}
		return [
			line.substring(0, line.indexOf("%" + identifier)),
			param,
			line.substring(line.indexOf("%" + identifier) + identifier.length + 1),
		].join("")
	},
}

// %5d - padded integer
const paddedIntParser: IStringFormatParser = {
	name: "padded-int-parser",
	testRegex: /^([0\-]?)(\d+)d$/,
	formatter(identifier: string, line: string, param: StringFormatParam): string {
		if (!isParsableNumber(<string>param)) {
			throw TypeErrors.INTEGER_TYPE_ERROR(param)
		}
		let length = parseInt(RegExp.$2) - param!.toString().length
		let regex2int = parseInt(RegExp.$2)
		let replaceStr = ""
		if (length < 0) { length = 0 }
		// Won't have a default case due to the regex
		// tslint:disable-next-line: switch-default
		switch (RegExp.$1) {
			case "": // right align
				replaceStr = (Array(length + 1).join(" ") + param).slice(-regex2int)
				break
			case "-": // left align
				replaceStr = (param + Array(length + 1).join(" ")).slice(-regex2int)
				break
			case "0": // zero fill
				replaceStr = (Array(length + 1).join("0") + param).slice(-regex2int)
				break
		}
		return line.replace(
			"%" + identifier,
			replaceStr
		)
	},
}

// %o - octet
const octetParser: IStringFormatParser = {
	name: "octet-parser",
	testRegex: /^([o])$/,
	formatter(identifier: string, line: string, param: StringFormatParam): string {
		if (!isParsableNumber(<string>param)) {
			throw TypeErrors.INTEGER_TYPE_ERROR(param)
		}
		return line.replace(
			"%" + identifier,
			parseInt(<string>param).toString(8)
		)
	},
}

// %b - binary
const binaryParser: IStringFormatParser = {
	name: "binary-parser",
	testRegex: /^(b)$/,
	formatter(identifier: string, line: string, param: StringFormatParam): string {
		if (!isParsableNumber(<string>param)) {
			throw TypeErrors.INTEGER_TYPE_ERROR(param)
		}
		return line.replace(
			"%" + identifier,
			parseInt(<string>param).toString(2)
		)
	},
}

// %x, %X - hexadecimal
const hexParser: IStringFormatParser = {
	name: "hex-parser",
	testRegex: /^([xX])$/,
	formatter(identifier: string, line: string, param: StringFormatParam): string {
		if (!isParsableNumber(<string>param)) {
			throw TypeErrors.INTEGER_TYPE_ERROR(param)
		}
		let hex = parseInt(<string>param).toString(16)
		if (identifier === "X") { hex = hex.toUpperCase() }
		return line.replace(
			"%" + identifier,
			hex
		)
	},
}

// %c - character
const charParser: IStringFormatParser = {
	name: "char-parser",
	testRegex: /^(c)$/,
	formatter(identifier: string, line: string, param: StringFormatParam): string {
		if (!isParsableNumber(<string>param)) {
			throw TypeErrors.INTEGER_TYPE_ERROR(param)
		}
		return line.replace(
			"%" + identifier,
			String.fromCharCode(parseInt(<string>param))
		)
	},
}

// %5s - padded string
const paddedStringParser: IStringFormatParser = {
	name: "padded-string-parser",
	testRegex: /^(-?)(\d+)s$/,
	formatter(identifier: string, line: string, param: StringFormatParam): string {
		if (typeof param !== "string") {
			throw TypeErrors.STRING_TYPE_ERROR(param)
		}
		let length = parseInt(RegExp.$2) - param!.toString().length, regex2int = parseInt(RegExp.$2), replaceStr = ""
		if (length < 0) { length = 0 }
		// Won't have a default case due to the regex
		// tslint:disable-next-line: switch-default
		switch (RegExp.$1) {
			case "": // right align
				replaceStr = (Array(length + 1).join(" ") + param).slice(-regex2int)
				break
			case "-": // left align
				replaceStr = (param + Array(length + 1).join(" ")).slice(-regex2int)
				break
		}
		return [
			line.substring(0, line.indexOf("%" + identifier)),
			replaceStr,
			line.substring(line.indexOf("%" + identifier) + identifier.length + 1),
		].join("")
	},
}

// %4.5s - string with max length
const stringMaxParser: IStringFormatParser = {
	name: "string-max-parser",
	testRegex: /^(-?\d*)\.(\d+)s$/,
	formatter(identifier: string, line: string, param: StringFormatParam): string {
		if (typeof param !== "string") {
			throw TypeErrors.STRING_TYPE_ERROR(param)
		}
		let max = 0, replaceStr = "", spaceWidth = 0, regex2int = parseInt(RegExp.$2)

		// %.4s
		if (RegExp.$1 === "") {
			replaceStr = param.slice(0, regex2int)
		}

		// %-5.4s or %5.4s
		else {
			param = param.slice(0, regex2int)
			max = Math.abs(parseInt(RegExp.$1))
			spaceWidth = max - param.length
			replaceStr = RegExp.$1.indexOf("-") !== -1 ?
				(param + Array(spaceWidth + 1).join(" ")).slice(-max) :
				(Array(spaceWidth + 1).join(" ") + param).slice(-max)
		}

		return [
			line.substring(0, line.indexOf("%" + identifier)),
			replaceStr,
			line.substring(line.indexOf("%" + identifier) + identifier.length + 1),
		].join("")
	},
}

// %u - unicode
const unicodeParser: IStringFormatParser = {
	name: "unicode-parser",
	testRegex: /^(u)$/,
	formatter(identifier: string, line: string, param: StringFormatParam): string {
		if (!isParsableNumber(<string>param)) {
			throw TypeErrors.INTEGER_TYPE_ERROR(param)
		}
		return line.replace(
			"%" + identifier,
			(parseInt(<string>param, 10) >>> 0).toString()
		)
	},
}

// %e - exponential
const exponentialParser: IStringFormatParser = {
	name: "exponential-parser",
	testRegex: /^(-?)(\d*).?(\d?)(e)$/,
	formatter(identifier: string, line: string, param: StringFormatParam): string {
		if (!isParsableNumber(<string>param)) {
			throw TypeErrors.INTEGER_TYPE_ERROR(param)
		}
		let leftPad = RegExp.$1 === "-"
		let width = RegExp.$2
		let decimal = RegExp.$3 !== "" ? Number(RegExp.$3) : undefined
		let value = Number(<string>param).toExponential(decimal)
		let mantissa, exponent, padLength

		if (width !== "") {
			if (decimal !== undefined) {
				padLength = parseInt(width) - value.length
				if (padLength < 0) {
					// I don't know whats going on here,
					// and we were not supposed to get here
					// but in co-pilot we must trust
					throw new RangeError(`width (${width}) is too small for value (${value})`)
				}
				value = leftPad ?
					value + Array(padLength + 1).join(" ") :
					Array(padLength + 1).join(" ") + value
			}
			else {
				mantissa = value.split("e")[0] || "";
				exponent = "e" + value.split("e")[1]
				padLength = parseInt(width) - mantissa.length - exponent.length
				value = padLength >= 0 ?
					mantissa + Array(padLength + 1).join("0") + exponent :
					mantissa.slice(0, padLength) + exponent
			}
		}

		return line.replace(
			"%" + identifier,
			value
		)
	},
}

// %f - floating point
const floatParser: IStringFormatParser = {
	name: "float-parser",
	testRegex: /^(-?)(\d*).?(\d?)(f)$/,
	formatter(identifier: string, line: string, param: StringFormatParam): string {
		if (!isParsableNumber(<string>param)) {
			throw TypeErrors.INTEGER_TYPE_ERROR(param)
		}
		let leftPad = RegExp.$1 === "-",
			intParam = parseInt(<string>param),
			width = RegExp.$2,
			decimal = RegExp.$3,
			DOT_LENGTH = 1,
			integerPart = parseInt(<string>param) > 0 ?
				Math.floor(intParam)
				: Math.ceil(intParam),
			value = parseFloat(<string>param).toFixed(decimal !== "" ? Number(decimal) : 6),
			mantissaWidth,
			spaceWidth

		if (width !== "") {
			if (decimal !== "") {
				mantissaWidth = integerPart.toString().length + DOT_LENGTH + parseInt(decimal, 10)
				spaceWidth = parseInt(width) - mantissaWidth
				value = leftPad ?
					parseFloat(<string>param).toFixed(parseInt(decimal)) + Array(spaceWidth + 1).join(" ") :
					Array(spaceWidth + 1).join(" ") + parseFloat(<string>param).toFixed(parseInt(decimal))
			}
			else {
				value = parseFloat(<string>param).toFixed(
					parseInt(width) - integerPart.toString().length - DOT_LENGTH
				)
			}
		}

		return line.replace(
			"%" + identifier,
			value
		)
	},
}

//#endregion

/**
 * Support C-Style String formatting
 * The following formats are supported:
 * - %s - string
 * - %d - integer
 * - %u - unicode
 * - %e - exponential
 * - %f - floating point
 * - %c - character
 * - %b - binary
 * - %o - octal
 * - %x - hexadecimal
 * - %X - hexadecimal
 *
 * @see https://github.com/tmaeda1981jp/string-format-js for C-Style formatting
 */
export default class CStyleFormatter implements IStringFormatter {

	public get name() { return this.constructor.name }

	/**
	 * List of formats supported by the C-Style formatter out of the box
	 */
	private static DEFAULT_FORMAT_PARSERS: IStringFormatParser[] = [
		stringIntParser,
		paddedIntParser,
		octetParser,
		binaryParser,
		hexParser,
		charParser,
		paddedStringParser,
		stringMaxParser,
		unicodeParser,
		exponentialParser,
		floatParser,
	]

	/**
	 * The regex used to test if a string is a format string
	 * This populates RegExp.$1 with the format identifier
	 */
	private static IDENTIFIER_REGEX: RegExp = /%([.#0-9\-]*[a-zA-Z])/

	// set of format parser which can be used to format string
	private formatParsers: Map<string, IStringFormatParser>

	constructor() {
		// add default format parsers
		this.formatParsers = new Map<string, IStringFormatParser>()
		CStyleFormatter.DEFAULT_FORMAT_PARSERS.forEach(parser => {
			this.addFormatParser(parser)
		})
	}

	/**
	 * @inheritdoc
	 * @since 0.1.0
	 */
	public isFormatParserSupported(): boolean {
		return true
	}

	/**
	 * @inheritdoc
	 * @param formatParser the format parser
	 * @since 0.1.0
	 */
	public addFormatParser(formatParser: IStringFormatParser): void {
		const identifier = formatParser.name
		if (this.formatParsers.has(identifier)) {
			throw new Error(`Format parser ${identifier} already exists`)
		}
		this.formatParsers.set(identifier, formatParser)
		// this.logger.debug(`Added format parser ${identifier}`)
	}

	/**
	 * @inheritdoc
	 * @param {string} identifier the format parser identifier
	 * @returns {boolean} true if the format parser is available
	 * @since 0.1.0
	 */
	public hasFormatParser(identifier: string): boolean {
		return this.formatParsers.has(identifier)
	}

	/**
	 * @inheritdoc
	 * @param formatParserName the name of the format parser
	 * @since 0.1.0
	 */
	public removeFormatParser(formatParserName: string): void {
		Assert.isString("formatParserName", formatParserName)
		if (!this.formatParsers.has(formatParserName)) {
			throw new Error(`Format parser ${formatParserName} does not exist`)
		}
		// remove the format parser from the set
		this.formatParsers.delete(formatParserName)
		// this.logger.debug(`Removed format parser ${formatParserName}`)
	}

	/**
	 * @inheritdoc
	 * @since 0.1.0
	 * @returns {false} false transformers feature is not supported by the C-Style formatter
	 */
	public isTransformersSupported(): boolean {
		return false
	}

	/**
	 * @inheritdoc
	 * @param key the transformer key
	 * @param transformer Transformer
	 * @since 0.1.0
	 * @throws {Error} if the transformer is not supported
	 */
	public addTransformer(key: string, transformer: TStringTransformer): void {
		throw new Error(`Transformers functionality is not supported by the C-Style formatter`)
	}

	/**
	 * @inheritdoc
	 * @param key the transformer key
	 * @returns {boolean} true if the transformer is available
	 * @since 0.1.0
	 */
	public hasTransformer(key: string): boolean {
		throw new Error(`Transformers functionality is not supported by the C-Style formatter`)
	}

	/**
	 * @inheritdoc
	 * @param key the transformer key
	 * @since 0.1.0
	 * @throws {Error} if the transformer is not supported
	 */
	public removeTransformer(key: string): void {
		throw new Error(`Transformers functionality is not supported by the C-Style formatter`)
	}

	/**
	 * @inheritdoc
	 * @param {string} input the input string
	 * @param {any[]} param the parameters
	 * @returns {[boolean, string]} is processed, the formatted string
	 * @since 0.1.0
	 * @throws {Error} if the input string is not a format string
	 */
	public format(input: string, ...params: any[]): [boolean, string] {
		Assert.isString("input", input)
		let formatted: boolean = false
		let formattedString: string = input

		for (let i = 0; i < params.length; i++) {
			if (formattedString.match(CStyleFormatter.IDENTIFIER_REGEX)) {
				let identifier = RegExp.$1
				// this.logger.debug(`Found identifier '${identifier}'`)
				// find the formatter
				let formatter: IStringFormatParser | undefined
				for (const f of this.formatParsers.values()) {
					if (f.testRegex.test(identifier)) {
						formatter = f
						// this.logger.debug(`Found formatter ${formatter.name}`)
						break
					}
				}
				if (formatter) {
					formattedString = formatter.formatter(identifier, formattedString, params[i])
					formatted = true
				}
			}
		}

		return [formatted, formattedString,]
	}

}
