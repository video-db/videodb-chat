<template>
  <div>
    <div
      class="vdb-c-mb-24 vdb-c-grid vdb-c-grid-cols-12 vdb-c-gap-24 sm:vdb-c-mb-32 sm:vdb-c-gap-32"
    >
      <div
        v-for="(item, index) in paginatedVideos"
        :key="`post-${item.id}`"
        class="vdb-c-col-span-12 sm:vdb-c-col-span-6 md:vdb-c-col-span-4 lg:vdb-c-col-span-3"
        @click="$emit('video-click', item)"
      >
        <video-card
          :item="item"
          :border-b="true"
          :index="index"
          border-class="sm:vdb-c-hidden"
        />
      </div>
    </div>
    <div class="vdb-c-mt-24 vdb-c-flex vdb-c-justify-center">
      <PaginationButton
        :target-page="-1"
        :state="currentPage === 1 ? 'disabled' : 'default'"
        :is-first="true"
        label="Previous"
        @click="goToPage"
      />

      <PaginationButton
        v-for="pageNumber in displayedPageNumbers"
        :key="pageNumber"
        :target-page="pageNumber"
        :state="currentPage === pageNumber ? 'active' : 'default'"
        :label="pageNumber"
        @click="goToPage"
      />

      <PaginationButton
        :target-page="totalPages + 1"
        :state="currentPage === totalPages ? 'disabled' : 'default'"
        :is-last="true"
        label="Next"
        @click="goToPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import VideoCard from "./VideoCard.vue";
import PaginationButton from "./PaginationButton.vue";

const props = defineProps({
  videoResults: {
    type: Array,
    default: () => [],
  },
  itemsPerPage: {
    type: Number,
    default: 8,
  },
});

const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(props.videoResults.length / props.itemsPerPage),
);

const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return props.videoResults.slice(start, end);
});

const displayedPageNumbers = computed(() => {
  const range = 1;
  let start = Math.max(1, currentPage.value - range);
  let end = Math.min(totalPages.value, currentPage.value + range);

  if (end - start < range * 2) {
    if (start === 1) {
      end = Math.min(start + range * 2, totalPages.value);
    } else {
      start = Math.max(end - range * 2, 1);
    }
  }

  let numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  // Add first page button if not already included
  if (numbers[0] !== 1) {
    numbers.unshift(1);
  }

  // Add last page button if not already included
  if (numbers[numbers.length - 1] !== totalPages.value) {
    numbers.push(totalPages.value);
  }

  return numbers;
});

const goToPage = (page) => {
  if (page < 1) {
    currentPage.value--;
  } else if (page > totalPages.value) {
    currentPage.value++;
  } else {
    currentPage.value = page;
  }
};

defineEmits(["video-click"]);
</script>
