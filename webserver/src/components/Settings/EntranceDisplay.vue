<template>
  <div v-if="loaded">
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="entrance"
      sort-by="entrance"
      group-by="seen"
      class="elevation-1"
    >
      <template #[`item.leadsTo`]="{ item }">
        <v-btn @click="selectEntrance(item)">
          {{ item.leadsTo || 'Select' }}
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
const { useGetters: useGameStateGetters } = createNamespacedHelpers(
  'serverGameState'
);

const headers = [
  {
    value: 'entrance',
    text: 'Entrance',
  },
  {
    value: 'leadsTo',
    text: 'Leads to',
  },
  {
    text: 'Seen',
    value: 'seen',
  },
];

function formatEntrances(entrancesToCheck, knownEntrances) {
  const result = [];
  for (const entrance of entrancesToCheck) {
    result.push({
      entrance: entrance,
      leadsTo: null,
      seen: false,
    });
  }
  for (const [from, to] of Object.entries(knownEntrances)) {
    result.push({
      entrance: from,
      leadsTo: to,
      seen: true,
    });
  }
  return result;
}

export default {
  name: 'EntranceDisplay',
  setup() {
    const lastUpdateKey = ref(1);

    const {
      entrancesToCheck,
      knownEntrances,
      allEntrances,
    } = useGameStateGetters([
      'entrancesToCheck',
      'knownEntrances',
      'allEntrances',
    ]);

    const items = computed(() =>
      formatEntrances(entrancesToCheck.value, knownEntrances.value)
    );

    const loaded = computed(() => !!allEntrances);

    return {
      headers,
      items,
      loaded,
      lastUpdateKey,
    };
  },
};
</script>
