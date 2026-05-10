// bun test src/problems/09-deep-equals/test/deep-equals.test.ts

import { detectType } from '@course/utils'

export function deepEquals(a: any, b: any, cache = new Map()): boolean {
  if (a === b) {
    return true
  }
  if (cache.has(a) && cache.get(a)!.has(b)) {
    return true
  }
  const [typeA, typeB] = [detectType(a), detectType(b)]
  if (typeA !== typeB) return false

  if (typeA === 'object' || typeA === 'array') {
    const [keysA, keysB] = [Object.keys(a), Object.keys(b)]
    if (keysA.length !== keysB.length) return false

    if (!cache.has(a)) cache.set(a, new Set())
    cache.get(a)!.add(b)
  
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key) || !deepEquals(a[key], b[key], cache)) {
        return false
      }
    }
    return true
  }

  return a === b
}

// --- Examples ---
// Uncomment to test your implementation:

console.log('1 =>', ' true', deepEquals(1, 1)) // Expected: true
console.log('2 =>', ' true', deepEquals('hello', 'hello')) // Expected: true
console.log('3 =>', ' false', deepEquals(null, undefined)) // Expected: false
console.log('4 ===>', ' true', deepEquals([1, 2, 3], [1, 2, 3])) // Expected: true
console.log('5 =>', ' true', deepEquals({ a: 1, b: 2 }, { b: 2, a: 1 })) // Expected: true
console.log('6 =>', ' false', deepEquals({ a: 1 }, { a: 2 })) // Expected: false

const a: any = { value: 1 }
a.self = a
const b: any = { value: 1 }
b.self = b
console.log('7 =>', ' true', deepEquals(a, b)) // Expected: true (circular)
