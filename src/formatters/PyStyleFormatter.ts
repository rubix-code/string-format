import { IStringFormatParser, IStringFormatter, TStringTransformer } from "@/StringFormat"

//#region PyStyleFormatter Transformer
const jsonTransformer = {
	name: "json",
	fn: (input: any) => JSON.stringify(input),
}
//#endregion

enum FormatIndexingMode {
	UNDEFINED,
	IMPLICIT,
	EXPLICIT,
}

function assertState(key: string, existingState: FormatIndexingMode) {
	if (key.length > 0) {
		if (existingState === FormatIndexingMode.IMPLICIT) {
			throw Error("cannot switch from " +
				"implicit to explicit format indexing")
		}
		return FormatIndexingMode.EXPLICIT
	} else {
		if (existingState === FormatIndexingMode.EXPLICIT) {
			throw Error("cannot switch from " +
				"explicit to implicit format indexing")
		}
		return FormatIndexingMode.IMPLICIT
	}

}

function create(regex: RegExp, transformers: { [x: string]: (arg0: any) => any; }) {
	return function (input: string, ...param: any[]): [boolean, string] {
		let index = 0
		let state = FormatIndexingMode.UNDEFINED
		let isFormatted = false

		let output = input.replace(
			regex,
			function (match: any, literal: any, _key: any, transformerName: string) {
				isFormatted = true
				if (literal != null) {
					return literal
				}
				let key: string = _key
				state = assertState(key, state)
				if (_key.length <= 0) {
					key = String(index)
					index += 1
				}

				//  1.  Split the key into a lookup path.
				//  2.  If the first path component is not an index, prepend '0'.
				//  3.  Reduce the lookup path to a single result. If the lookup
				//      succeeds the result is a singleton array containing the
				//      value at the lookup path; otherwise the result is [].
				//  4.  Unwrap the result by reducing with '' as the default value.
				let path = key.split(".")
				let value = (/^\d+$/.test(path[0]!) ? path : ["0",].concat(path))
					.reduce(
						function (maybe: any[], key: string) {
							return maybe.reduce(
								function (_: any, x: { [x: string]: any; }) {
									return x != null && key in Object(x) ?
										[typeof x[key] === "function" ? x[key]() : x[key],] :
										[]
								},
								[]
							)
						},
						[param,]
					)
					.reduce(function (_: any, x: any) { return x }, "")

				if (transformerName == null) {
					return value
				} else if (Object.hasOwn(transformers, transformerName)) {
					const transformer = transformers[transformerName];
					if(typeof transformer !== "function") throw Error("transformer must be a function which takes a single argument.");
					return transformer(value)
				} else {
					throw Error("no transformer named \"" + transformerName + "\"")
				}
			}
		)

		return [isFormatted, output,]
	}
}

/**
 * Python style string formatter
 *
 * @class PyStyleFormatter
 * @implements {IStringFormatter}
 * @see {@link https://docs.python.org/3/library/string.html#format-string-syntax}
 * @see {@link https://github.com/davidchambers/string-format}
 */
export default class PyStyleFormatter implements IStringFormatter {

	private static readonly IDENTIFIER_REGEX = /([{}])\1|[{](.*?)(?:\|(.+?))?[}]/g

	/**
	 * List of transformers
	 */
	private transformers: { [key: string]: TStringTransformer } = {}

	constructor() {
		// register default transformers
		this.addTransformer(jsonTransformer.name, jsonTransformer.fn)
	}

	/**
	 * @inheritdoc
	 */
	public get name(): string {
		return this.constructor.name
	}

	/**
	 * @inheritdoc
	 * @since 0.1.0
	 */
	public isFormatParserSupported(): boolean {
		return false
	}

	/**
	 * @inheritdoc
	 * @param formatParser the format parser
	 * @since 0.1.0
	 */
	public addFormatParser(formatParser: IStringFormatParser): void {
		throw new Error(`${this.name} does not support adding format parsers`)
	}

	/**
	 * @inheritdoc
	 * @param {string} identifier the format parser identifier
	 * @returns {boolean} true if the format parser is available
	 * @since 0.1.0
	 */
	public hasFormatParser(formatParserName: string): boolean {
		throw new Error(`${this.name} does not support adding format parsers`)
	}

	/**
	 * @inheritdoc
	 * @param formatParserName the name of the format parser
	 * @since 0.1.0
	 */
	public removeFormatParser(formatParserName: string): void {
		throw new Error(`${this.name} does not support removing format parsers`)
	}

	/**
	 * @inheritdoc
	 * @since 0.1.0
	 * @returns {false} false transformers feature is not supported by the C-Style formatter
	 */
	public isTransformersSupported(): boolean {
		return true
	}

	/**
	 * @inheritdoc
	 * @param key the transformer key
	 * @param transformer Transformer
	 * @since 0.1.0
	 * @throws {Error} if the transformer is not supported
	 */
	public addTransformer(key: string, transformer: TStringTransformer): void {
		if (this.transformers[key]) {
			throw new Error(`Transformer ${key} already exists`)
		}
		this.transformers[key] = transformer
	}

	/**
	 * @inheritdoc
	 * @param key the transformer key
	 * @returns {boolean} true if the transformer is available
	 * @since 0.1.0
	 */
	public hasTransformer(key: string): boolean {
		return this.transformers[key] !== undefined
	}

	/**
	 * @inheritdoc
	 * @param key the transformer key
	 * @since 0.1.0
	 * @throws {Error} if the transformer is not supported
	 */
	public removeTransformer(key: string): void {
		if (!this.transformers[key]) {
			throw new Error(`Transformer ${key} does not exist.`)
		}
		else delete this.transformers[key]
	}

	/**
	 * @inheritdoc
	 * @param {string} input the input string
	 * @param {any[]} param the parameters
	 * @returns {[boolean, string]} is processed, the formatted string
	 * @since 0.1.0
	 * @throws {Error} if the input string is not a format string
	 */
	public format(input: string, ...param: any[]): [boolean, string] {
		let result = create(PyStyleFormatter.IDENTIFIER_REGEX, this.transformers)(input, ...param)

		return result
	}

}
