<template>
  <div class="vdb-c-relative">
    <div
      class="vdb-c-w-full vdb-c-bg-black vdb-c-flex vdb-c-justify-center vdb-c-items-center"
      v-if="videoData"
    >
      <div :class="isFullScreen ? 'vdb-c-w-screen vdb-c-h-screen' : 'vdb-c-videoPlayerContainer'">
        <VideoDBPlayer
          ref="videoPlayer"
          :class="isFullScreen ? 'vdb-c-w-screen vdb-c-h-screen' : ''"
          :stream-url="videoData?.stream_url"
          :default-overlay="false"
          @fullScreenChange="handleFullScreenChange"
        >
          <template v-slot:overlay>
            <BigCenterButton class="vdb-c-absolute vdb-c-top-1/2 vdb-c-left-1/2" />
            <SearchInsideMedia
              :search-content="searchContent"
              :search-suggestions="searchSuggestions"
              :search-results="searchResults"
              :search-results-loading="searchResultsLoading"
              :show-search-results="showSearchResults"
              @toggle-results="showSearchResults = $event"
              @search-change="handleSearchChange"
              @search-submit="handleSearchSubmit"
            />
          </template>
        </VideoDBPlayer>
      </div>
    </div>

    <!-- Video Player Loading -->
    <div v-else class="vdb-c-w-full vdb-c-bg-[#EEEFF2] vdb-c-flex vdb-c-justify-center vdb-c-items-center">
      <div class="videoPlayerContainer">
        <div class="vdb-c-w-full vdb-c-h-full vdb-c-animate-pulse vdb-c-aspect-video"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue";
import { useVideoDBChat } from "../../context";

const { fetchCollectionVideo } = useVideoDBChat();

const props = defineProps({
  collectionId: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
});

async function fetchVideo() {
  const videoResult = await fetchCollectionVideo(
    props.collectionId,
    props.videoId,
  );
  console.log("Video data result:", videoResult);
  return videoResult.data;
}

watch(
  () => props.videoId,
  (newVideoId) => {
    fetchVideo();
  },
  { immediate: true },
);
</script>

<style scoped></style>
