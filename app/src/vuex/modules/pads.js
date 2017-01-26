import _ from 'lodash'

import Pad from '../../models/pad'
import Sample from '../../models/sample'

const state = {
  items: [
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() }),
    new Pad({ sample: new Sample() })
  ]
}

const types = {
  ACTIVATE_PAD: 'ACTIVATE_PAD',
  DEACTIVATE_PAD: 'DEACTIVATE_PAD',
  SET_OUTPUT_DEVICE: 'SET_OUTPUT_DEVICE',
  SET_OUTPUT_DEVICE_FAILED: 'SET_OUTPUT_DEVICE_FAILED'
}

// TODO: Proper pad mutations...
const mutations = {
  [types.ACTIVATE_PAD] (state, { pad }) {
    // TODO: Is it a bad practice not to bother looking up the sample in the state tree?
    pad.activated = true
  },

  [types.DEACTIVATE_PAD] (state, { pad }) {
    pad.activated = false
  },

  [types.SET_OUTPUT_DEVICE] (state, { deviceId }) {
    // Initial implementation - set the output device on all pad samples
    state.items.forEach((pad) => {
      if (!pad.sample) {
        return
      }

      pad.sample.outputDevice = deviceId
    })
  },

  [types.SET_OUTPUT_DEVICE_FAILED] (state, { deviceId }) {
    // Set all pads back to default output device (safest option)
    state.items.forEach((pad) => {
      if (!pad.sample) {
        return
      }

      pad.sample.outputDevice = 'default'
    })
  }
}

const actions = {
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

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
