import * as types from '../mutation-types'
import Pad from '../../models/pad'
import Sample from '../../models/sample'

const state = {
  pads: [
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

// TODO: Proper pad mutations...
const mutations = {
  [types.DECREMENT_MAIN_COUNTER] (state) {
    state.main--
  },
  [types.INCREMENT_MAIN_COUNTER] (state) {
    state.main++
  }
}

export default {
  state,
  mutations
}
