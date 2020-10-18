import { post_set_entrance } from '../api/api_gamestate';

const state = {
  entrancesToCheck: [],
  knownEntrances: {},
  locationsToCheck: [],
  locationsChecked: [],
  equipment: [],
  settingsString: '',
  gameState: null,
  worldConfig: null,
};

const getters = {
  settingsString: (state) => state.settingsString,
  entrancesToCheck: (state) => state.entrancesToCheck,
  knownEntrances: (state) => state.knownEntrances,
  worldConfig: (state) => state.worldConfig,
  worldConfigRegions: (state) => state.worldConfig?.regions || [],
};

function parseEntrancesToCheck(gameState) {
  return gameState.please_explore.map((x) => x.split('goesto').shift().trim());
}

function parseKnownEntrances(gameState) {
  const result = {};
  for (const entranceInfo of gameState.known_exits) {
    const split = entranceInfo.split('goesto');
    const from = split[0].trim();
    const to = split[1].trim();
    result[from] = to;
  }
  return result;
}

const mutations = {
  setGameState(state, gameState) {
    state.gameState = gameState;
    state.settingsString = gameState.settings_string[0];
    state.entrancesToCheck = parseEntrancesToCheck(gameState);
    state.knownEntrances = parseKnownEntrances(gameState);
  },
  setWorldConfig(state, worldConfig) {
    state.worldConfig = worldConfig;
  },
};

const actions = {
  setGameState({ commit }, gameState) {
    console.log('setGameState', gameState);
    commit('setGameState', gameState);
  },
  setWorldConfig({ commit }, gameState) {
    console.log('setWorldConfig', gameState);
    commit('setWorldConfig', gameState);
  },
  async setEntranceDestination({ commit }, { from, to }) {
    console.log(`setEntranceDestination "${from}" goesto "${to}"`);
    const gameState = await post_set_entrance(from, to);
    commit('setGameState', gameState);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
