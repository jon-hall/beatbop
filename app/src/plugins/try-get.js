/**
 * Helper for trying to access a property at a path which may contain undefined items.
 */
export default function (Vue, options) {
  Vue.prototype.$tryGet = function (propertyPath, defaultValue = undefined) {
    const path = propertyPath.match(/([^.[\]]+)/g) || []
    let node = this

    do {
      const part = path.shift()
      node = node[part]

      if (node != null) {
        // Carry on if node isn't null/undefined (e.g. we won't crash when we try to de-reference it)
        continue
      }

      // Else, return default, unless this is the end of the path and the value is null, then return null
      return !path.length && node === null ? null : defaultValue
    } while (path.length)

    // ESLint appears to fail in evaluating that the 'continue' allows this code to be reached...
    /* eslint-disable no-unreachable */
    return node
    /* eslint-enable no-unreachable */
  }
}

/**
 * Vuex mapState/mapAction etc. -inspired helper for more cleanly mapping multiple 'tryGet' computeds.
 */
export function mapTryGet (propertyMap) {
  const getters = {}

  for (let property in propertyMap) {
    getters[property] = function () {
      return this.$tryGet(propertyMap[property])
    }
  }

  return getters
}
