// bun test src/problems/02-debounce/test/debounce.test.ts

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timerID: ReturnType<typeof setTimeout> | null = null
  return function debounced(this: unknown, ...args: Parameters<T>) {
    if (timerID) {
      clearTimeout(timerID)
    }
    timerID = setTimeout(() => {
      fn.apply(this, args)
      timerID = null
    }, delay)
  }
}

// --- Examples ---
// Uncomment to test your implementation:

const log = debounce((msg: string) => console.log(msg), 300)
log('a') // cancelled by next call
log('b') // cancelled by next call
log('c') // only this one fires after 300ms → "c"
