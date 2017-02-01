import types from './mutation-types'
import { passThroughAction } from '../../../utils/vuex'

export default {
  setEditingSample: passThroughAction(types.SET_EDITING_SAMPLE)
}
