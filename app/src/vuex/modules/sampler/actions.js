import _ from 'lodash'

import types from './mutation-types'

export default {
  activatePad ({ commit }, { pad }) {
    commit(types.ACTIVATE_PAD, { pad })
  },

  deactivatePad ({ commit }, { pad }) {
    commit(types.DEACTIVATE_PAD, { pad })
  },

  setOutputDevice ({ commit }, { deviceId }) {
    commit(types.SET_OUTPUT_DEVICE, { deviceId })
  },

  setOutputDeviceFailed: _.debounce(
    function ({ commit }, { pad, deviceId }) {
      // TODO: Inject logger service...
      console.log('Running SET_OUTPUT_DEVICE_FAILED mutation...')
      commit(types.SET_OUTPUT_DEVICE_FAILED, { pad, deviceId })
    },
    // Don't run for 500ms, while we gather other failures
    500
  )
}
