import { PropOptions } from 'vue'

export function oneOf(keys: string[]): PropOptions['validator'] {
  return value => {
    return keys.indexOf(value) !== -1
  }
}

export const range = (min: number, max: number): number[] => {
  if (min > max) {
    throw new Error('The first argument must be smaller than the second arg.')
  }

  if (min == max) {
    throw new Error('Both of the given arguments must not be identical to each other.')
  }

  const nums: number[] = []
  for (let i = min; i <= max; i += 1) {
    nums.push(i)
  }
  return nums
}

export const maskStr = (str: string) => {
  if (!str || str.length < 4) return ''
  const head = range(0, str.length - 3).map(_ => '*')
  const tail = str.slice(str.length - 2, str.length)
  return [...head, ...tail].join('')
}
