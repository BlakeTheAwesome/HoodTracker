<template>
  <v-menu v-model="menuOpen" offset-y :close-on-content-click="false">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on">
        {{ toRegion || 'Select' }}
      </v-btn>
    </template>
    <v-card>
      <v-app-bar v-if="toRegion" flat dense>
        <v-row>
          <span v-text="toRegion" />
          <v-spacer />
          <v-btn @click="selectEntrance(null, null)">
            {{ 'clear' }}
          </v-btn>
        </v-row>
      </v-app-bar>
      <v-divider />
      <v-card-text>
        <v-list style="max-height: 300px" class="overflow-y-auto">
          <v-list-item-group>
            <v-list-item
              v-for="(regionInfo, regionIdx) in sortedRegions"
              :key="regionIdx"
            >
              <v-list-item-content>
                <v-list-item-title
                  @click="selectEntrance(regionInfo)"
                  v-text="regionInfo.name"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import { ref, computed } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
const {
  useGetters: useGameStateGetters,
  useActions: useGameStateActions,
} = createNamespacedHelpers('serverGameState');

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
    const { setEntranceDestination } = useGameStateActions([
      'setEntranceDestination',
    ]);
    const menuOpen = ref(false);

    const selectEntrance = async (toRegionInfo) => {
      const toRegion = toRegionInfo && toRegionInfo.name;
      console.log(
        `Setting: ${props.fromRegion} -> ${props.fromEntrance} => ${toRegion}`
      );
      await setEntranceDestination({
        fromRegion: props.fromRegion,
        fromEntrance: props.fromEntrance,
        toRegion: toRegion,
      });
      menuOpen.value = false;
    };

    const sortRegions = (regions) => {
      return [...regions].sort((a, b) => a.name.localeCompare(b.name));
    };

    const sortExits = (exits) => {
      return [...exits].sort((a, b) => a.name.localeCompare(b.name));
    };

    const sortedRegions = computed(() => sortRegions(worldConfigRegions.value));

    return {
      sortedRegions,
      sortExits,
      selectEntrance,
      menuOpen,
    };
  },
};
</script>
