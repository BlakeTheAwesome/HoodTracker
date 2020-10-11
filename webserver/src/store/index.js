import Vue from 'vue';
import Vuex from 'vuex';

import serverSettings from './serverSettings';
import serverGameState from './serverGameState';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    serverSettings,
    serverGameState,
  },
});
