<template>
  <div v-if="loaded">
    <v-row align="center">
      <v-col cols="6">
        <v-select
          :key="'activeSave' + lastUpdateKey"
          v-model="loadFileName"
          :items="saveFileList"
          label="Save File"
          solo
        />
      </v-col>
      <v-col cols="2">
        <v-btn @click="loadGame">
          <v-icon left> mdi-file-download </v-icon>
          Load Game
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="6">
        <v-text-field
          :key="'filename' + lastUpdateKey"
          v-model="unsavedFileName"
          append-icon="mdi-undo"
          filled
          label="New File Name"
          type="text"
          :rules="filenameValidation"
          @click:append="revertSaveFileName"
        />
        <v-text-field
          :key="'settings' + lastUpdateKey"
          v-model="unsavedSettingsString"
          append-icon="mdi-undo"
          filled
          label="Settings String"
          type="text"
          :rules="settingsStringValidation"
          @click:append="revertSettingsString"
        />
      </v-col>
      <v-col cols="2">
        <v-btn @click="newGame(false)">
          <v-icon left> mdi-plus-circle </v-icon>
          New Game
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, onMounted, computed } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
const {
  useGetters: useSettingsGetters,
  useActions: useSettingsActions,
} = createNamespacedHelpers('serverSettings');
const { useGetters: useGameStateGetters } = createNamespacedHelpers(
  'serverGameState'
);

const settingsStringRegex = new RegExp('^([A-Z0-9]+)$');
const settingsStringValidation = [
  (str) =>
    settingsStringRegex.test(str) || 'Must be uppercase characters and numbers',
];

const filenameRegex = new RegExp('^([A-Za-z0-9_\\.]+)$');
const filenameValidation = [
  (str) =>
    filenameRegex.test(str) || 'Must be letters, numbers, underscores and dots',
];

export default {
  name: 'SettingsPanel',
  setup() {
    const loadFileName = ref('');
    const unsavedFileName = ref('');
    const unsavedSettingsString = ref('');
    const loaded = ref(false);
    const lastUpdateKey = ref(1);

    const {
      loadSaveFileList,
      loadInitialSaveFile,
      loadSaveFile,
      startNewGame,
    } = useSettingsActions([
      'loadSaveFileList',
      'loadInitialSaveFile',
      'loadSaveFile',
      'startNewGame',
    ]);
    const { saveFileName, saveFileList } = useSettingsGetters([
      'saveFileName',
      'saveFileList',
    ]);
    const { settingsString } = useGameStateGetters(['settingsString']);

    const revertSaveFileName = () => {
      unsavedFileName.value = saveFileName.value;
    };

    const revertSettingsString = () => {
      unsavedSettingsString.value = settingsString.value;
    };

    const settingsStringValid = computed(() =>
      settingsStringValidation.every(
        (rule) => rule(unsavedSettingsString.value) === true
      )
    );
    const filenameValid = computed(() =>
      filenameValidation.every((rule) => rule(unsavedFileName.value) === true)
    );

    onMounted(async () => {
      await loadInitialSaveFile();
      loadFileName.value = saveFileName.value;
      revertSaveFileName();
      revertSettingsString();
      loaded.value = true;
    });

    const loadGame = async () => {
      console.log('start load');
      await loadSaveFile(loadFileName.value);
      revertSaveFileName();
      revertSettingsString();
      console.log('key change');
      lastUpdateKey.value = lastUpdateKey.value + 1;
    };
    const newGame = async (overwriteExisting) => {
      if (settingsStringValid.value && filenameValid.value) {
        await startNewGame({
          filename: unsavedFileName.value,
          settingsString: unsavedSettingsString.value,
          overwriteExisting: overwriteExisting,
        });
        loadFileName.value = unsavedFileName.value;
        lastUpdateKey.value = lastUpdateKey.value + 1;
      }
    };

    return {
      loadFileName,
      unsavedFileName,
      unsavedSettingsString,
      saveFileList,
      revertSaveFileName,
      revertSettingsString,
      loadSaveFileList,
      loaded,
      loadGame,
      newGame,
      settingsStringValidation,
      filenameValidation,
      lastUpdateKey,
    };
  },
};
</script>
