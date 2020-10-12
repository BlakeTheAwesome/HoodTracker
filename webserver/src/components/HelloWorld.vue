<template>
  <v-container>
    <settings-panel />
    <entrance-display />
  </v-container>
</template>

<script>
import SettingsPanel from './Settings/SettingsPanel';
import EntranceDisplay from './Settings/EntranceDisplay';
export default {
  name: 'HelloWorld',

  components: {
    SettingsPanel,
    EntranceDisplay,
  },
};
</script>
