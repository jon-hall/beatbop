import actions from './actions'
import getters from './getters'
import mutations from './mutations'

import Pad from '../../../models/pad'
import Sample from '../../../models/sample'

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

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
