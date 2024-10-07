<template>
  <div class="vdb-c-relative vdb-c-rounded-20 vdb-c-bg-white">
    <div v-if="message.status === 'progress'" class="vdb-c-py-10">
      <bouncing-ellipses />
    </div>
    <div
      v-else-if="message.status === 'not_generated' || !message?.data?.shots"
      class="vdb-c-flex vdb-c-flex-col"
    >
      <div
        class="vdb-c-mb-8 vdb-c-flex vdb-c-text-subheader vdb-c-text-steelblue-600"
      >
        No relevant results were found
      </div>
      <p class="vdb-c-markdown-body vdb-c-text-kilvish-900">
        Couldn't find any matching results for your query. Try searching for
        something else?
      </p>
    </div>
    <div v-else-if="message.status === 'success'">
      <search-list-item
        :search-results="adjustedSearchResults"
        :search-term="searchTerm"
        :is-contractable="isContractable"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import BouncingEllipses from "../atoms/BouncingEllipses.vue";
import SearchListItem from "../search/SearchListItem.vue";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  searchTerm: {
    type: String,
    default: "",
  },
});

const adjustedSearchResults = computed(() => {
  return { data: { results: [props.message.data] } };
});

const isContractable = computed(() => {
  return (
    adjustedSearchResults.value &&
    adjustedSearchResults.value.data.results.length > 1
  );
});
</script>

<style></style>
