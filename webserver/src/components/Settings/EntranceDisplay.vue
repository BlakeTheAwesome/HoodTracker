<template>
  <div v-if="loaded">
    <v-expansion-panels multiple>
      <v-expansion-panel
        v-for="(category, categoryIdx) in regionGroups"
        :key="categoryIdx"
      >
        <v-expansion-panel-header v-text="category.name" />
        <v-expansion-panel-content>
          <v-expansion-panels multiple accordion>
            <v-expansion-panel
              v-for="(entrances, region) in category.regions"
              :key="region"
            >
              <v-expansion-panel-header v-text="region" />
              <v-expansion-panel-content>
                <v-list>
                  <v-list-item
                    v-for="(entranceInfo, entranceIdx) in entrances"
                    :key="entranceIdx"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="entranceInfo.entrance" />
                    </v-list-item-content>

                    <v-list-item-action>
                      <entrance-select
                        :from-region="region"
                        :from-entrance="entranceInfo.entrance"
                        :to-region="entranceInfo.toRegion"
                        :to-entrance="entranceInfo.toEntrance"
                      />
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import EntranceSelect from './EntranceSelect';
import { computed } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
const { useGetters: useGameStateGetters } = createNamespacedHelpers(
  'serverGameState'
);

function splitRegion(entrance) {
  return entrance.split(' -> ');
}

function formatEntranceGroups(
  entrancesToCheck,
  knownEntrances,
  worldConfigRegions
) {
  console.log('entrancesToCheck', JSON.stringify(entrancesToCheck));
  console.log('knownEntrances', JSON.stringify(knownEntrances));
  console.log('worldConfigRegions', JSON.stringify(worldConfigRegions));

  const regionsToCheck = {};
  for (const entrance of entrancesToCheck) {
    const [region, entranceName] = splitRegion(entrance);
    if (!regionsToCheck[region]) {
      regionsToCheck[region] = [];
    }
    regionsToCheck[region].push({
      entrance: entranceName,
      toRegion: null,
      toEntrance: null,
    });
  }

  const regionsChecked = {};
  for (const [from, to] of Object.entries(knownEntrances)) {
    const [fromRegion, fromEntranceName] = splitRegion(from);
    const [toRegion, toEntranceName] = splitRegion(to);
    if (!regionsChecked[fromRegion]) {
      regionsChecked[fromRegion] = [];
    }
    regionsChecked[fromRegion].push({
      entrance: fromEntranceName,
      toRegion: toRegion,
      toEntrance: toEntranceName,
    });
  }

  const entranceListed = (region, entrance) => {
    const toCheck = regionsToCheck[region];
    if (toCheck && toCheck.some((x) => x.entrance == entrance)) {
      return true;
    }

    const checked = regionsChecked[region];
    if (checked && checked.some((x) => x.entrance == entrance)) {
      return true;
    }
    return false;
  };

  const unreachableRegions = {};
  for (const regionInfo of worldConfigRegions) {
    const regionName = regionInfo.name;
    for (const entrance of regionInfo.exits) {
      if (entranceListed(regionName, entrance)) {
        continue;
      }
      if (!unreachableRegions[regionName]) {
        unreachableRegions[regionName] = [];
      }
      unreachableRegions[regionName].push({
        entrance: entrance.name,
        toRegion: null,
        toEntrance: null,
      });
    }
  }

  return [
    {
      name: 'Entrances To Check',
      regions: regionsToCheck,
    },
    {
      name: 'Entrances Checked',
      regions: regionsChecked,
    },
    {
      name: 'Unreachable Entrances',
      regions: unreachableRegions,
    },
  ];
}

export default {
  name: 'EntranceDisplay',
  components: {
    EntranceSelect,
  },
  setup() {
    const {
      entrancesToCheck,
      knownEntrances,
      worldConfigRegions,
    } = useGameStateGetters([
      'entrancesToCheck',
      'knownEntrances',
      'worldConfigRegions',
    ]);

    const loaded = computed(
      () =>
        (entrancesToCheck.value && worldConfigRegions.value && true) || false
    );

    const regionGroups = computed(() => {
      if (!loaded.value) {
        return [];
      }
      return formatEntranceGroups(
        entrancesToCheck.value,
        knownEntrances.value,
        worldConfigRegions.value
      );
    });

    return {
      regionGroups,
      loaded,
    };
  },
};
</script>
