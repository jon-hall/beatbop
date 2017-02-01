import _ from 'lodash'

import types from './mutation-types'
import { passThroughAction } from '../../../utils/vuex'

export default {
  activatePad: passThroughAction(types.ACTIVATE_PAD),

  deactivatePad: passThroughAction(types.DEACTIVATE_PAD),

  setOutputDevice: passThroughAction(types.SET_OUTPUT_DEVICE),

  setOutputDeviceFailed: _.debounce(
    passThroughAction(types.SET_OUTPUT_DEVICE_FAILED),
    500
  ),

  setSampleFromBlob: passThroughAction(types.SET_SAMPLE_FROM_BLOB),

  setSampleTitle: passThroughAction(types.SET_SAMPLE_TITLE),

  toggleSampleRepeat: passThroughAction(types.TOGGLE_SAMPLE_REPEAT)
}
