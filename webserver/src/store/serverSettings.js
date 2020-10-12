import {
  get_saveFiles,
  get_worldConfig,
  post_loadSaveFile,
  post_startNewGame,
} from '../api/api_settings';

const state = {
  activeFilename: '',
  saveFileList: [],
};

const getters = {
  saveFileName: (state) => state.activeFilename,
  saveFileList: (state) => state.saveFileList,
};

const mutations = {
  setSaveFileName(state, filename) {
    state.activeFilename = filename;
  },
  setSaveFileList(state, fileList) {
    state.saveFileList = fileList;
  },
};

const actions = {
  async loadSaveFileList({ commit }) {
    console.log('loadSaveFileList');
    const fileList = await get_saveFiles();
    console.log('commiting setSaveFileList ', fileList);
    commit('setSaveFileList', fileList);
    return fileList;
  },
  async loadInitialSaveFile({ commit, dispatch }) {
    console.log('loadInitialSaveFile');
    const fileList = await dispatch('loadSaveFileList');
    console.log('Commiting', fileList);
    commit('setSaveFileName', fileList[0]);
  },
  async loadSaveFile({ commit, dispatch }, filename) {
    console.log('loadSaveFile');
    const gameState = await post_loadSaveFile(filename);
    const worldConfig = await get_worldConfig();
    await dispatch('serverGameState/setGameState', gameState, { root: true });
    await dispatch('serverGameState/setWorldConfig', worldConfig, {
      root: true,
    });
    commit('setSaveFileName', filename);
  },
  async startNewGame(
    { commit, dispatch },
    { filename, settingsString, overwriteExisting }
  ) {
    console.log('loadSaveFile');
    const gameState = await post_startNewGame(
      filename,
      settingsString,
      overwriteExisting
    );
    const worldConfig = await get_worldConfig();
    await dispatch('serverGameState/setGameState', gameState, { root: true });
    await dispatch('serverGameState/setWorldConfig', worldConfig, {
      root: true,
    });
    commit('setSaveFileName', filename);
    await dispatch('loadSaveFileList');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
