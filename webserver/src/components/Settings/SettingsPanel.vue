<template>
  <div>
    <v-text-field
      v-if="loaded"
      v-model="unsavedFileName"
      append-icon="mdi-undo"
      append-outer-icon="mdi-content-save"
      prepend-icon="mdi-dots-vertical"
      filled
      label="Save File"
      type="text"
      @click:prepend="openSaveSelect"
      @click:append="revertSaveFileName"
      @click:append-outer="updateSaveFile"
    />
  </div>
</template>

<script>
import { ref, onMounted } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
const {
  useGetters: useServerGetters,
  useActions: useServerActions,
  useMutations: useServerMutations,
} = createNamespacedHelpers('server'); // specific module name

export default {
  name: 'HelloWorld',
  setup() {
    const { loadSaveFileList, loadInitialSaveFile } = useServerActions([
      'loadSaveFileList',
      'loadInitialSaveFile',
    ]);
    const { saveFileName, saveFileList } = useServerGetters([
      'saveFileName',
      'saveFileList',
    ]);
    const { setSaveFileName } = useServerMutations(['setSaveFileName']);
    const unsavedFileName = ref('');
    const loaded = ref(false);

    onMounted(async () => {
      console.log('kicking load');
      await loadInitialSaveFile();
      console.log(`Finished, value appears to be "${saveFileName.value}"`);
      unsavedFileName.value = saveFileName.value;
      loaded.value = true;
    });

    const updateSaveFile = () => {
      console.log('Setting global filename to ', unsavedFileName.value);
      setSaveFileName(unsavedFileName.value);
    };

    const revertSaveFileName = () => {
      unsavedFileName.value = saveFileName.value;
      console.log('revertSaveFileName to ', unsavedFileName.value);
    };

    const openSaveSelect = () => {
      console.log(`Pick now from: ${saveFileList.value}`);
    };

    return {
      unsavedFileName,
      saveFileList,
      updateSaveFile,
      revertSaveFileName,
      loadSaveFileList,
      loaded,
      openSaveSelect,
    };
  },
};
</script>
