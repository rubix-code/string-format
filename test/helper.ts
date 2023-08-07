import { IStringFormatParser, IStringFormatter, StringFormat, StringFormatParam, TStringTransformer } from "@/StringFormat"

/**
 * Resets the String format function to only use the specified formatter.
 *
 * @param {IStringFormatter} formatter the formatter
 * @returns {StringFormat} the string format instance
 * @since 0.1.0
 */
export function onlyFormatter(formatter: IStringFormatter): StringFormat {
	const strFormat = new StringFormat()
	strFormat.addFormatter(formatter)
	strFormat.extend(String)
	return strFormat
}

export const DummyFormatParser: IStringFormatParser = {
	name: "dummy-format-parser",
	testRegex: /^(T)$/,
	formatter(identifier: string, line: string, param: StringFormatParam): string {
		return line
	},
}

export const DummyJSONTransformer: TStringTransformer = (input: string): string => {
	return JSON.stringify(input)
}

export class DummyFormatter implements IStringFormatter {

	private transformers: Map<string, TStringTransformer> = new Map()
	private formatterName: string

	public get name(): string {
		return this.formatterName
	}

	constructor(name?: string) {
		this.formatterName = name || this.constructor.name
	}

	public isFormatParserSupported(identifier: string): boolean {
		return true
	}

	public addFormatParser(formatParser: IStringFormatParser): void {
		return
	}

	public hasFormatParser(identifier: string): boolean {
		return true
	}

	public removeFormatParser(formatParserName: string): void {
		return
	}

	public isTransformersSupported(): boolean {
		return true
	}

	public addTransformer(key: string, transformer: TStringTransformer): void {
		this.transformers.set(key, transformer)
	}

	public hasTransformer(key: string): boolean {
		return this.transformers.has(key)
	}

	public removeTransformer(key: string): void {
		this.transformers.delete(key)
	}
	public format(input: string, ...param: any[]): [boolean, string] {
		// transform %T|X to json(param[0])
		// regex to find %T|X where "|X" is mandatory
		const regex = /(%T(\|[^\s]+))/
		let result = input
		let isFormatted = false
		for (let i = 0; i < param.length; i++) {
			if (result.match(regex)) {
				const [, transformerName = "",] = RegExp.$1.split("|")
				const transformer = this.transformers.get(transformerName) || ((input) => input)
				result = result.replace(regex, transformer(param[i]))
				isFormatted = true
			}
		}
		return [isFormatted, result,]
	}
}
