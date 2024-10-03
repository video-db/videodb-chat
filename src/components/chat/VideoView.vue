<template>
  <div class="vdb-c-relative">
    <div
      class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-center vdb-c-bg-black"
      v-if="videoData"
    >
      <div
        :class="
          isFullScreen
            ? 'vdb-c-h-screen vdb-c-w-screen'
            : 'videoPlayerContainer'
        "
      >
        <VideoDBPlayer
          ref="videoPlayer"
          :class="isFullScreen ? 'vdb-c-h-screen vdb-c-w-screen' : ''"
          :stream-url="videoData?.stream_url"
          :default-overlay="false"
          @fullScreenChange="handleFullScreenChange"
        >
          <template v-slot:overlay>
            <BigCenterButton
              class="vdb-c-absolute vdb-c-left-1/2 vdb-c-top-1/2"
            />
            <!-- <SearchInsideMedia
              :search-content="searchContent"
              :search-suggestions="searchSuggestions"
              :search-results="searchResults"
              :search-results-loading="searchResultsLoading"
              :show-search-results="showSearchResults"
              @toggle-results="showSearchResults = $event"
              @search-change="handleSearchChange"
              @search-submit="handleSearchSubmit"
            /> -->
          </template>
        </VideoDBPlayer>
      </div>
    </div>

    <!-- Video Player Loading -->
    <div
      v-else
      class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-center vdb-c-bg-[#EEEFF2]"
    >
      <div class="-videoPlayerContainer">
        <div
          class="vdb-c-aspect-video vdb-c-h-full vdb-c-w-full vdb-c-animate-pulse"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";
import {
  VideoDBPlayer,
  BigCenterButton,
  SearchInsideMedia,
} from "@videodb/player-vue";
import "@videodb/player-vue/dist/style.css";
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

const isFullScreen = ref(false);
const videoData = ref(null);

const handleFullScreenChange = (isFullScreen) => {
  isFullScreen.value = isFullScreen;
};

watch(
  () => props.videoId,
  async () => {
    const videoResult = await fetchCollectionVideo(
      props.collectionId,
      props.videoId,
    );
    console.log("Video result:", videoResult);
    videoData.value = videoResult.data;
    console.log("Video data:", videoData.value);
  },
  { immediate: true },
);
</script>

<style scoped>
.videoPlayerContainer {
  width: 100%;
  height: 55vh;
  position: relative;
  display: flex;
  justify-content: center;
}

@media (min-width: 640px) {
  .videoPlayerContainer {
    width: 90%;
    height: auto;
    margin: auto;
    position: relative;
  }
}

@media (min-width: 1024px) {
  .videoPlayerContainer {
    width: 80%;
    height: auto;
  }
}

@media (min-width: 1280px) {
  .videoPlayerContainer {
    width: 70%;
    height: auto;
  }
}
</style>
