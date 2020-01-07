import { deepEqual } from 'assert'
import { isRight, isLeft, Either, Left } from 'fp-ts/lib/Either'

/**
 * 
 * helpers
 */
function toEqual<T>(actual: T, expected: T): boolean {
  try {
    deepEqual(actual, expected)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Custom matchers
 */

export function toBeRight<E, A>(either: Either<E, A>): jest.CustomMatcherResult {
  const pass = isRight(either)
  const green = `expected ${either} not to be Right`
  const red = `expected ${either} to be Right`
  return {
    pass,
    message: () => pass ? green : red
  }
}

export function toBeLeft<E, A>(either: Either<E, A>, value: E): jest.CustomMatcherResult {
  const pass = isLeft(either) && toEqual(either.left, value)
  const actual = JSON.stringify((either as Left<E>).left)
  const expected = JSON.stringify(value)
  const green = `expected ${actual} not to be ${expected}`
  const red = `expected ${actual} to be ${expected}`
  return {
    pass,
    message: () => pass ? green: red
  }
}
