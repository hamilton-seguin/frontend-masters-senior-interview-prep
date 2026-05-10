// bun test src/problems/09-deep-equals/test/deep-equals.test.ts
import { detectType } from '@course/utils'

type SeenPairs = Map<object, WeakSet<object>>

function hasSeenPair(a: object, b: object, seen: SeenPairs) {
  return seen.get(a)?.has(b) ?? false
}

function addSeenPair(a: object, b: object, seen: SeenPairs) {
  let matches = seen.get(a)
  if (!matches) {
    matches = new WeakSet<object>()

    seen.set(a, matches)
  }
  matches.add(b)
}

export function deepEquals(a: any, b: any, seen: SeenPairs = new Map()): boolean {
  if (a === b) return true

  const typeA = detectType(a)
  const typeB = detectType(b)
  if (typeA !== typeB) return false

  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return a === b
  }

  if (hasSeenPair(a, b, seen)) return true
  addSeenPair(a, b, seen)

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false

  const keysBSet = new Set(keysB)
  for (const key of keysA) {
    if (!keysBSet.has(key)) return false
  }

  for (const key of keysA) {
    if (!deepEquals(a[key], b[key], seen)) return false
  }

  return true
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
