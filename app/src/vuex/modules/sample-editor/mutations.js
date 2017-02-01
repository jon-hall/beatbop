import types from './mutation-types'

export default {
  [types.SET_EDITING_SAMPLE] (state, { sample }) {
    state.sample = sample
  }
}
