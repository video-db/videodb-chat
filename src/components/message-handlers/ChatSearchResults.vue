<template>
  <div class="vdb-c-relative vdb-c-rounded-20 vdb-c-bg-white">
    <LoadingMessage
      :status="message.status"
      :message="message.status_message"
      :is-last-conv="isLastConv"
    />
    <div v-if="message.status === 'success'">
      <search-list-item
        :search-results="message.search_results"
        :search-term="searchTerm"
        :is-contractable="isContractable"
      />
    </div>
    <div v-else-if="message.status === 'progress'">
      <search-list-item-loader />
    </div>
  </div>
</template>

<script setup>
import SearchListItem from "./search/SearchListItem.vue";
import LoadingMessage from "./elements/LoadingMessage.vue";
import SearchListItemLoader from "./search/SearchListItemLoader.vue";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  searchTerm: {
    type: String,
    default: "",
  },
  isLastConv: {
    type: Boolean,
    default: false,
  },
});
const getArr = () => {
  const arr = [];
  for (let i = 0; i < 2; i++) {
    arr.push(i + 1);
  }
  return arr;
};
</script>

<style></style>
