import _ from 'lodash'

import types from './mutation-types'

// Helper for the common case of a simple 'pass-through' action which commits a mutation with the
// supplied args
function passThroughAction (type) {
  return function ({ commit }, ...args) {
    commit(type, ...args)
  }
}

export default {
  activatePad: passThroughAction(types.ACTIVATE_PAD),

  deactivatePad: passThroughAction(types.DEACTIVATE_PAD),

  setOutputDevice: passThroughAction(types.SET_OUTPUT_DEVICE),

  setOutputDeviceFailed: _.debounce(
    passThroughAction(types.SET_OUTPUT_DEVICE_FAILED),
    500
  ),

  setSampleFromBlob: passThroughAction(types.SET_SAMPLE_FROM_BLOB),

  setSampleTitle: passThroughAction(types.SET_SAMPLE_TITLE)
}
