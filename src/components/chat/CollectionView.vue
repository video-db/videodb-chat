<template>
  <div class="collection-view">
    <AllVideos v-if="collectionVideos !== null" :video-results="videos" @video-click="handleVideoClick" />
    <AllVideosLoader v-else />
  </div>
</template>

<script setup>
import { useVideoDBChat } from "../../context";
import AllVideos from "../collection/AllVideos.vue";
import AllVideosLoader from "../collection/AllVideosLoader.vue";
import { ref, watch, computed } from "vue";

const { fetchCollection, fetchCollectionVideos } = useVideoDBChat();

const props = defineProps({
  collectionId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['video-click']);

const collectionData = ref(null);
const collectionVideos = ref(null);

const videos = computed(() => {
  if (collectionVideos.value === null) {
    return [];
  }
  return collectionVideos.value;
});

const handleVideoClick = (video) => {
  emit('video-click', video);
};

watch(
  () => props.collectionId,
  async (newCollectionId) => {
    console.log("Fetching collection data for ID:", newCollectionId);
    const collectionResult = await fetchCollection(newCollectionId);
    console.log("Collection data result:", collectionResult);

    console.log("Fetching collection videos for ID:", newCollectionId);
    const videosResult = await fetchCollectionVideos(newCollectionId);
    console.log("Collection videos result:", videosResult);

    collectionData.value = collectionResult.data;
    collectionVideos.value = videosResult.data;

    console.log("Updated collectionData:", collectionData.value);
    console.log("Updated collectionVideos:", collectionVideos.value);
  },
  { immediate: true },
);
</script>

<style scoped></style>
