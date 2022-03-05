export function memoizeAsync(func, cacheError = false, resolver) {
  const cache = new Map()

  return (...args) => {
    const key = resolver ? resolver(...args) : args[0]

    if (cache.has(key)) {
      return cache.get(key)
    }

    const promise = func(...args).catch((err) => {
      if (cacheError === false) {
        // Remove the cached promise so we can re-call passed function
        cache.delete(key)
      }

      // Re-throw error
      throw err
    })

    // Cache whole promise
    // This will also prevent race conditions
    // from multiple concurrently running promises
    cache.set(key, promise)

    return promise
  }
}
