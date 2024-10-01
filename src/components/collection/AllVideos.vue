<template>
  <div class="vdb-c-grid vdb-c-grid-cols-12 vdb-c-gap-24 sm:vdb-c-gap-32 vdb-c-mb-24 sm:vdb-c-mb-32">
    <div
      v-for="(item, index) in videoResults"
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
</template>

<script setup>
import VideoCard from "./VideoCard.vue";

const props = defineProps({
  videoResults: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['video-click']);
</script>