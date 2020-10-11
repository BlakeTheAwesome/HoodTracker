// import axios from 'axios';
// import { buildUrl } from '../api/utils';

const state = {
  entrancesToCheck: [],
  locationsToCheck: [],
  locationsChecked: [],
  equipment: [],
  settingsString: '',
  gameState: {},
};

const getters = {
  // saveFileName: (state) => state.activeFilename,
  // saveFileList: (state) => state.saveFileList,
  settingsString: (state) => state.settingsString,
};

const mutations = {
  setGameState(state, gameState) {
    state.gameState = gameState;
    state.settingsString = gameState.settings_string[0];
  },
};

const actions = {
  setGameState({ commit }, gameState) {
    console.log('setGameState', gameState);
    commit('setGameState', gameState);
  },
  // async loadSaveFileList({ commit }) {
  //   console.log('loadSaveFileList');
  //   const url = buildUrl('save_files');
  //   const response = await axios.get(url);
  //   const fileList = response.data;
  //   console.log('commiting setSaveFileList ', fileList);
  //   commit('setSaveFileList', fileList);
  //   return fileList;
  // },
  // async loadInitialSaveFile({ commit, dispatch }) {
  //   console.log('loadInitialSaveFile');
  //   const fileList = await dispatch('loadSaveFileList');
  //   console.log('Commiting', fileList);
  //   commit('setSaveFileName', fileList[0]);
  // },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
