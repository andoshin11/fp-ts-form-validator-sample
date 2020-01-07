import { toBeRight, toBeLeft } from './helper'

/**
 * Register custom matchers
 */

beforeAll(() => {
  expect.extend({ toBeRight, toBeLeft })
})
