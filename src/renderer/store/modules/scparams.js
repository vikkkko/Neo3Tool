import * as types from '../mutation-types'

const state = {
  scparams: {
    sender: '',
    smartcontract: '',
    operation: '',
    args: [],
    hex: ''
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [types.UPDATE_SCPARAMS] (state, scparams) {
    state.scparams = scparams
  }
}

export default {
  state,
  mutations
}
