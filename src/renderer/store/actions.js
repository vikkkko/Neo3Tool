import * as types from './mutation-types'

export const updateVersion = function ({ commit }, version) {
  commit(types.UPDATE_VERSION, version)
}

export const updateMultiInfo = function ({ commit }, multiInfo) {
  commit(types.UPDATE_MULTIINFO, multiInfo)
}

export const updateScParams = function ({ commit }, scparams) {
  commit(types.UPDATE_SCPARAMS, scparams)
}

export const updateSettingN3T5 = function ({ commit }, netInfo) {
  commit(types.UPDATE_SETTING_N3T5, netInfo)
}

export const updateSettingMainnet = function ({ commit }, netInfo) {
  commit(types.UPDATE_SETTING_MAINNET, netInfo)
}

export const updateSettingCurNetId = function ({ commit }, curNetId) {
  commit(types.UPDATE_SETTING_CURNETID, curNetId)
}
