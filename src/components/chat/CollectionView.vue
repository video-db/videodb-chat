<template>
  <div class="vdb-c-mx-auto vdb-c-w-11/12 vdb-c-py-28">
    <VideoList
      v-if="collectionVideos !== null"
      :video-results="videos"
      @video-click="handleVideoClick"
    />
    <VideoListLoader v-else />
  </div>
</template>

<script setup>
import VideoList from "../collection/VideoList.vue";
import VideoListLoader from "../collection/VideoListLoader.vue";
import { computed } from "vue";

const props = defineProps({
  collectionId: {
    type: String,
    required: true,
  },
  collectionData: {
    type: Object,
    default: null,
  },
  collectionVideos: {
    type: Array,
    default: null,
  },
});

const emit = defineEmits(["video-click"]);

const videos = computed(() => {
  if (props.collectionVideos === null) {
    return [];
  }
  return props.collectionVideos;
});

const handleVideoClick = (video) => {
  emit("video-click", video);
};
</script>

<style scoped></style>
