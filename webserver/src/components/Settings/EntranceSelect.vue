<template>
  <v-menu v-model="menuOpen" offset-y :close-on-content-click="false">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on">
        {{ toEntrance || 'Select' }}
      </v-btn>
    </template>
    <v-btn @click="selectEntrance(null, null)">
      {{ 'clear' }}
    </v-btn>
    <v-divider />
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(regionInfo, index) in worldConfigRegions"
        :key="index"
      >
        <v-expansion-panel-header v-text="regionInfo.name" />
        <v-expansion-panel-content>
          <v-list-item-group>
            <v-list-item
              v-for="(exitInfo, exitIdx) in regionInfo.exits"
              :key="exitIdx"
            >
              <v-list-item-content>
                <v-list-item-title
                  @click="selectEntrance(regionInfo, exitInfo)"
                  v-text="exitInfo.name"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-menu>
</template>

<script>
import { ref } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
const { useGetters: useGameStateGetters } = createNamespacedHelpers(
  'serverGameState'
);

export default {
  name: 'EntranceSelect',
  props: {
    fromRegion: {
      type: String,
      required: true,
    },
    fromEntrance: {
      type: String,
      required: true,
    },
    toRegion: {
      type: String,
      required: false,
      default: null,
    },
    toEntrance: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const { worldConfigRegions } = useGameStateGetters(['worldConfigRegions']);
    const menuOpen = ref(false);

    const selectEntrance = (toRegionInfo, toEntranceInfo) => {
      console.log(
        `Setting: ${props.fromRegion} -> ${props.fromEntrance} => ${toRegionInfo.name} -> ${toEntranceInfo.name}`
      );
      menuOpen.value = false;
    };

    return {
      worldConfigRegions,
      selectEntrance,
      menuOpen,
    };
  },
};
</script>
