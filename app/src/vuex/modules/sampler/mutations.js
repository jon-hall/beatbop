import types from './mutation-types'

export default {
  [types.ACTIVATE_PAD] (state, { pad }) {
    // TODO: Is it a bad practice not to bother looking up the sample in the state tree?
    pad.activated = true
  },

  [types.DEACTIVATE_PAD] (state, { pad }) {
    pad.activated = false
  },

  [types.SET_OUTPUT_DEVICE] (state, { deviceId }) {
    // Initial implementation - set the output device on all pad samples
    state.pads.forEach((pad) => {
      if (!pad.sample) {
        return
      }

      pad.sample.outputDevice = deviceId
    })
  },

  [types.SET_OUTPUT_DEVICE_FAILED] (state, { deviceId }) {
    // Set all pads back to default output device (safest option)
    state.pads.forEach((pad) => {
      if (!pad.sample) {
        return
      }

      pad.sample.outputDevice = 'default'
    })
  }
}
