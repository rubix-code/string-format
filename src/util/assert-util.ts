import assert from "assert"
import { TypeOfTag } from "typescript"
import _ from "lodash"
import { Class } from "type-fest"

/**
 * Assert Utility
 *
 * TODO: move assert to its own package
 *
 * @see https://github.com/Tiliqua/assert-js/blob/master/src/AssertJS/Assert.js
 * @export
 * @class AssertUtil
 */
export class Assert {

	/**
	 * Assert data type is not null
	 *
	 * @static
	 * @template T Value type
	 * @param {string} name
	 * @param {any} value
	 * @param {string} expectedType
	 * @returns {value is T}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static notNull<T>(name: string, value: any, expectedType: string): value is T {
		if (value === null)
			throw new assert.AssertionError({
				message: `'${name}' is a null object. Expected type '${expectedType}'`,
				expected: expectedType,
				actual: null,
				operator: name,
			})
		return true
	}

	/**
	 * Assert data type is not undefined
	 *
	 * @static
	 * @template T Value type
	 * @param {string} name data name
	 * @param {T} value data
	 * @returns {value is T}
	 * @memberof Assert
	 */
	public static isDefined<T>(name: string, value: any): value is T {
		if (value === undefined)
			throw new assert.AssertionError({
				message: `'${name}' is undefined.`,
				actual: null,
				operator: name,
			})
		return true
	}

	/**
	 * Assert data is a date
	 *
	 * @static
	 * @param {string} name variable name
	 * @param {any} value variable value
	 * @returns {value is Date}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isDate(name: string, value: any): value is Date {
		if (!(value instanceof Date))
			throw new assert.AssertionError({
				message: `'${name}' is not a date.`,
				actual: value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert data type is number
	 *
	 * @static
	 * @param {string} name variable name
	 * @param {any} value variable value
	 * @returns {value is number}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isNumber(name: string, value: any): value is number {
		if (typeof value !== "number")
			throw new assert.AssertionError({
				message: `Expected '${name}' to be of type of 'number' but got '${typeof value}'`,
				expected: "number",
				actual: typeof value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert data type is string
	 *
	 * @static
	 * @param name
	 * @param value
	 * @returns {value is string}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isString(name: string, value: any): value is string {
		if (typeof value !== "string")
			throw new assert.AssertionError({
				message: `Expected '${name}' to be of type of 'string' but got '${typeof value}'`,
				expected: "string",
				actual: typeof value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert data type is boolean
	 *
	 * @static
	 * @param name
	 * @param value
	 * @returns {value is boolean}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isBoolean(name: string, value: any): value is boolean {
		if (typeof value !== "boolean")
			throw new assert.AssertionError({
				message: `Expected '${name}' to be of type of 'boolean' but got '${typeof value}'`,
				expected: "boolean",
				actual: typeof value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert data is true
	 *
	 * @static
	 * @param {string} name variable name
	 * @param {boolean} value variable value
	 * @returns {value is true}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isTrue(name: string, value: boolean): value is true {
		if (value !== true)
			throw new assert.AssertionError({
				message: `Expected '${name}' to be true but got '${value}'`,
				expected: true,
				actual: value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert data is false
	 *
	 * @static
	 * @param {string} name variable name
	 * @param {boolean} value variable value
	 * @returns {value is false}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isFalse(name: string, value: boolean): value is false {
		if (value !== false)
			throw new assert.AssertionError({
				message: `Expected '${name}' to be false but got '${value}'`,
				expected: false,
				actual: value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert data is an array
	 *
	 * @static
	 * @template T Value type
	 * @param {string} name variable name
	 * @param {any} value variable value
	 * @returns {value is T[]}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isArray<T>(name: string, value: any): value is T[] {
		if (!Array.isArray(value))
			throw new assert.AssertionError({
				message: `Expected '${name}' to be of type of 'Array' but got '${typeof value}'`,
				expected: "Array",
				actual: typeof value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert data is an object
	 *
	 * @static
	 * @param {string} name variable name
	 * @param {any} value variable value
	 * @returns {value is object}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isObject(name: string, value: any): value is object {
		if (typeof value !== "object")
			throw new assert.AssertionError({
				message: `Expected '${name}' to be of type of 'object' but got '${typeof value}'`,
				expected: "object",
				actual: typeof value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert data is a function
	 *
	 * @static
	 * @param {string} name variable name
	 * @param {any} value variable value
	 * @returns {value is Function}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isFunction(name: string, value: any): value is Function {
		if (typeof value !== "function")
			throw new assert.AssertionError({
				message: `Expected '${name}' to be of type of 'function' but got '${typeof value}'`,
				expected: "function",
				actual: typeof value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert is equal
	 *
	 * @static
	 * @param {string} name variable name
	 * @param {any} value variable value
	 * @param {any} expected expected value
	 * @returns {true}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isEqual(name: string, value: any, expected: any): true {
		if (!_.isEqual(value, expected)) {
			throw new assert.AssertionError({
				message: `Expected '${name}' to be equal to '${expected}' but got '${value}'`,
				expected,
				actual: value,
				operator: name,
			})
		}
		return true
	}

	/**
	 * Assert is greater than
	 *
	 * @static
	 * @param {string} name variable name
	 * @param {number} value variable value
	 * @param {number} expected expected value
	 * @returns {true}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isGreaterThan(name: string, value: number, expected: number): true {
		Assert.isNumber(`${name}`, value)
		Assert.isNumber(`expected ${name}`, expected)
		if (value <= expected)
			throw new assert.AssertionError({
				message: `Expected '${name}' to be greater than '${expected}' but got '${value}'`,
				expected,
				actual: value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert is greater than or equal
	 *
	 * @static
	 * @param {string} name variable name
	 * @param {number} value variable value
	 * @param {number} expected expected value
	 * @returns {true}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isGreaterThanOrEqual(name: string, value: number, expected: number): true {
		Assert.isNumber(`${name}`, value)
		Assert.isNumber(`expected ${name}`, expected)
		if (value < expected)
			throw new assert.AssertionError({
				message: `Expected '${name}' to be greater than or equal to '${expected}' but got '${value}'`,
				expected,
				actual: value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert is less than
	 *
	 * @static
	 * @param {string} name variable name
	 * @param {number} value variable value
	 * @param {number} expected expected value
	 * @returns {true}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isLessThan(name: string, value: number, expected: number): true {
		Assert.isNumber(`${name}`, value)
		Assert.isNumber(`expected ${name}`, expected)
		if (value >= expected)
			throw new assert.AssertionError({
				message: `Expected '${name}' to be less than '${expected}' but got '${value}'`,
				expected,
				actual: value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert is less than or equal
	 *
	 * @static
	 * @param {string} name variable name
	 * @param {number} value variable value
	 * @param {number} expected expected value
	 * @returns {true}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static isLessThanOrEqual(name: string, value: number, expected: number): true {
		Assert.isNumber(`${name}`, value)
		Assert.isNumber(`expected ${name}`, expected)
		if (value > expected)
			throw new assert.AssertionError({
				message: `Expected '${name}' to be less than or equal to '${expected}' but got '${value}'`,
				expected,
				actual: value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert type of
	 *
	 * @static
	 * @template T type
	 * @param {string} name variable name
	 * @param {any} value variable value
	 * @param {string} expected expected value
	 * @returns {value is T}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static typeOf<T>(name: string, value: any, expectedType: TypeOfTag): value is T {
		if (typeof value !== expectedType)
			throw new assert.AssertionError({
				message: `Expected '${name}' to be of type of '${expectedType}' but got '${typeof value}'`,
				expected: expectedType,
				actual: typeof value,
				operator: name,
			})
		return true
	}

	/**
	 * Assert is instance of
	 *
	 * @static
	 * @template T type
	 * @param {string} name variable name
	 * @param {any} value variable value. an instance of T
	 * @param {string} expectedClass class T
	 * @returns {value is T}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static instanceOf<T extends Class>(name: string, value: any, expectedClass: T): value is InstanceType<T> {
		if (!(value instanceof expectedClass)) {
			const expectedInstanceName = expectedClass.name
			const valueName = value?.constructor?.name

			throw new assert.AssertionError({
				message: `Expected '${name}' to be instance of ${expectedInstanceName} but got '${valueName}'`,
				expected: expectedInstanceName,
				actual: valueName,
				operator: name,
			})
		}
		return true
	}

	/**
	 * Assert object has function
	 *
	 * @static
	 * @param {string} name object name
	 * @param {any} obj object value
	 * @param {string} fnName function name
	 * @returns {true}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static hasFunction(name: string, obj: any, fnName: string): true {
		if (!obj[fnName] || typeof obj[fnName] !== "function")
			throw new assert.AssertionError({
				message: `Expected '${name}' to have function '${fnName}' but got '${typeof obj[fnName]}'`,
				expected: "function",
				actual: typeof obj[fnName],
				operator: name,
			})
		return true
	}

	/**
	 * Assert object has property
	 *
	 * @static
	 * @param {string} name object name
	 * @param {any} obj object value
	 * @param {string} propName property name
	 * @returns {true}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static hasProperty(name: string, obj: any, propName: string): true {
		if (typeof obj[propName] === "undefined")
			throw new assert.AssertionError({
				message: `Expected '${name}' to have property '${propName}' but got '${typeof obj[propName]}'`,
				expected: "property",
				actual: typeof obj[propName],
				operator: name,
			})
		return true
	}

	/**
	 * Assert object has properties
	 *
	 * @static
	 * @param {string} name object name
	 * @param {any} obj object value
	 * @param {string[]} propNames property names
	 * @returns {true}
	 * @memberof Assert
	 * @throws AssertionError
	 */
	public static hasProperties(name: string, obj: any, propNames: string[]): true {
		for (const propName of propNames)
			Assert.hasProperty(name, obj, propName)
		return true
	}

}
