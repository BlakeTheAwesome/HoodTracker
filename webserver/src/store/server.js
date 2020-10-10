import axios from 'axios';
import { buildUrl } from './network';

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
    const url = buildUrl('save_files');
    const response = await axios.get(url);
    const fileList = response.data;
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
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
