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
import { useVideoDBChat } from "../../context";
import VideoList from "../collection/VideoList.vue";
import VideoListLoader from "../collection/VideoListLoader.vue";
import { ref, watch, computed } from "vue";

const { fetchCollectionVideos } = useVideoDBChat();

const props = defineProps({
  collectionId: {
    type: String,
    required: true,
  },
  collectionData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["video-click"]);

const collectionVideos = ref(null);

const videos = computed(() => {
  if (collectionVideos.value === null) {
    return [];
  }
  return collectionVideos.value;
});

const handleVideoClick = (video) => {
  emit("video-click", video);
};

watch(
  () => props.collectionId,
  async (newCollectionId) => {
    console.log("Fetching collection videos for ID:", newCollectionId);
    const videosResult = await fetchCollectionVideos(newCollectionId);
    console.log("Collection videos result:", videosResult);

    collectionVideos.value = videosResult.data;

    console.log("Updated collectionVideos:", collectionVideos.value);
  },
  { immediate: true },
);
</script>

<style scoped></style>
