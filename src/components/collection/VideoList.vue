<template>
  <div>
    <div
      class="vdb-c-mb-24 vdb-c-grid vdb-c-grid-cols-12 vdb-c-gap-24 sm:vdb-c-mb-32 sm:vdb-c-gap-32"
    >
      <div
        v-for="(item, index) in paginatedVideos"
        :key="`post-${item.id}`"
        class="vdb-c-col-span-12 sm:vdb-c-col-span-6 md:vdb-c-col-span-4 lg:vdb-c-col-span-3"
      >
        <video-card
          :item="item"
          :border-b="true"
          :index="index"
          border-class="sm:vdb-c-hidden"
          @video-click="$emit('video-click', $event)"
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
  const maxDisplayed = 5;
  const halfDisplay = Math.floor(maxDisplayed / 2);

  let start = Math.max(1, currentPage.value - halfDisplay);
  let end = Math.min(totalPages.value, start + maxDisplayed - 1);

  // Adjust start if end is at its maximum
  if (end === totalPages.value) {
    start = Math.max(1, end - maxDisplayed + 1);
  }

  // Adjust end if start is at its minimum
  if (start === 1) {
    end = Math.min(totalPages.value, maxDisplayed);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
