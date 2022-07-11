import * as types from '../mutation-types'

const state = {
  multiInfo: {
    pubKeys: [],
    signingThreshold: ''
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [types.UPDATE_MULTIINFO] (state, multiInfo) {
    state.multiInfo = multiInfo
  }
}

export default {
  state,
  mutations
}
