<template>
  <v-container>
    <settings-panel />
  </v-container>
</template>

<script>
import SettingsPanel from './Settings/SettingsPanel';
export default {
  name: 'HelloWorld',

  components: {
    SettingsPanel,
  },
};
</script>
