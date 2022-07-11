import * as types from '../mutation-types'

const state = {
  n3t5Info: {
    rpcUrl: '',
    magic: 0
  },
  mainnetInfo: {
    rpcUrl: '',
    magic: 0
  },
  curNetId: 0
}

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [types.UPDATE_SETTING_N3T5] (state, netInfo) {
    state.n3t5Info = netInfo
  },
  [types.UPDATE_SETTING_MAINNET] (state, netInfo) {
    state.mainnetInfo = netInfo
  },
  [types.UPDATE_SETTING_CURNETID] (state, netId) {
    state.curNetId = netId
  }
}

export default {
  state,
  mutations
}
