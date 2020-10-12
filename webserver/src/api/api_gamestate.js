import axios from 'axios';
import { buildUrl } from './utils';

export async function get_saveFiles() {
  const url = buildUrl('save_files');
  const response = await axios.get(url);
  const fileList = response.data;
  if (!Array.isArray(fileList)) {
    throw 'Response data was not an array of files';
  }
  return fileList;
}

export async function post_loadSaveFile(filename) {
  const url = buildUrl('load_file');
  const config = {
    params: {
      filename: filename,
    },
  };
  const data = null;
  const response = await axios.post(url, data, config);
  const gameState = response.data;
  if (!(gameState instanceof Object)) {
    throw `Response data was not the expected object, got: ${gameState}`;
  }
  return gameState;
}

export async function post_startNewGame(
  filename,
  settingsString,
  overwriteExisting
) {
  const url = buildUrl('start_new');
  const config = {
    params: {
      filename: filename,
      settings: settingsString,
      overwrite: overwriteExisting,
    },
  };
  const data = null;
  const response = await axios.post(url, data, config);
  const gameState = response.data;
  if (!(gameState instanceof Object)) {
    throw `Response data was not the expected object, got: ${gameState}`;
  }
  return gameState;
}

export async function post_set_entrance(from, to) {
  const url = buildUrl('set_entrance');
  const config = {
    params: {
      from: from,
      to: to,
    },
  };
  const data = null;
  const response = await axios.post(url, data, config);
  const gameState = response.data;
  if (!(gameState instanceof Object)) {
    throw `Response data was not the expected object, got: ${gameState}`;
  }
  return gameState;
}
