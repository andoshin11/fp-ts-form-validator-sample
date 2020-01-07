declare module 'jest-snapshot';
declare namespace jest {
  interface Matchers<R> {
    toBeRight(): R
    toBeLeft<T>(expected: T): R
  }
}