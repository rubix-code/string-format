import CStyleFormatter from "@/formatters/CStyleFormatter"
import PyStyleFormatter from "@/formatters/PyStyleFormatter"
import { StringFormat, TStringFormatFunction } from "./StringFormat"

/**
 * Register the string format function globally for typescript.
 * @see https://stackoverflow.com/questions/39877156/how-to-extend-string-prototype-and-use-it-next-in-typescript
 */
declare global {
	interface String {
		/**
		 * Format the string
		 */
		format: TStringFormatFunction
	}
}

/**
 * Global String Format Class
 *
 * The global string format functionality is created based on this class.
 */
class GlobalStringFormat extends StringFormat {
	constructor() {
		super()

		// TODO: [MAPLETS-49] Performance test the sequence.
		// it may be possible that py-c be slower than c-py.
		const pyStyleFormatter = new PyStyleFormatter()
		const cStyleFormatter = new CStyleFormatter()

		this.addFormatter(pyStyleFormatter)
		this.addFormatter(cStyleFormatter)

		this.extend(String)

		Object.seal(this)
		Object.seal(cStyleFormatter)
		Object.seal(pyStyleFormatter)
	}
}

/**
 * @link StringFormat
 */
const formatter = new GlobalStringFormat()

export default formatter
