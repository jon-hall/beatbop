// Helper for the common case of a simple 'pass-through' action which commits a mutation with the
// supplied args
export function passThroughAction (type) {
  return function ({ commit }, ...args) {
    commit(type, ...args)
  }
}
