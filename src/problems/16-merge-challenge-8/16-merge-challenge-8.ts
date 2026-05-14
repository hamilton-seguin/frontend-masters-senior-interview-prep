/**
 * 2.6 Merge
 *
 * Merge two types into a new type. Keys of the second type overrides the first type.
 *
 * @example
 * type Foo = { a: number; b: string }
 * type Bar = { b: number; c: boolean }
 *
 * type Result = Merge<Foo, Bar>
 * // { a: number; b: number; c: boolean }
 */

import type { Equal, Expect } from '@course/types'

/* _____________ Your Code Here _____________ */

type Merge<T extends {}, K extends {}> = {
  [P in keyof (T & K)]: P extends keyof K 
  ? K[P] 
  : P extends keyof T 
    ? T[P] 
    : never
}

/* _____________ Test Cases _____________ */

type Foo = { a: number; b: string }
type Bar = { b: number; c: boolean }

type cases = [Expect<Equal<Merge<Foo, Bar>, { a: number; b: number; c: boolean }>>]
