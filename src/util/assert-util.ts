import assert from "assert"

/**
 * Assert data type is string
 *
 * @param name
 * @param value
 * @returns {value is string}
 * @memberof Assert
 * @throws AssertionError
 */
export function isString(name: string, value: any): value is string {
	if (typeof value !== "string")
		throw new assert.AssertionError({
			message: `Expected '${name}' to be of type of 'string' but got '${typeof value}'`,
			expected: "string",
			actual: typeof value,
			operator: name,
		})
	return true
}
