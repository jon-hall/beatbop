import * as types from './mutation-types'

// TODO: Proper actions... (and move to "pads" module?)
export const decrementMain = ({ commit }) => {
  commit(types.DECREMENT_MAIN_COUNTER)
}

export const incrementMain = ({ commit }) => {
  commit(types.INCREMENT_MAIN_COUNTER)
}
