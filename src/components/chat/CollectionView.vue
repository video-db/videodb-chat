<template>
  <div class="vdb-c-mx-auto vdb-c-w-11/12 vdb-c-py-28">
    <div v-if="collectionVideos !== null">
      <VideoList
        v-if="videos.length > 0"
        :video-results="videos"
        @video-click="handleVideoClick"
      />
      <div
        v-else
        class="vdb-c-flex vdb-c-flex-col vdb-c-items-center vdb-c-justify-center vdb-c-gap-32 vdb-c-py-32 vdb-c-text-center vdb-c-text-black"
      >
        <div class="vdb-c-text-2xl vdb-c-font-bold">
          Your Collection is empty
        </div>
        <Button
          @click="
            loadSession();
            addMessage({
              content: [
                { type: 'text', text: 'Upload a video to this collection' },
              ],
            });
            chatInput = '';
          "
          variant="tertiary"
          class="vdb-c-mt-12"
        >
          <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-6">
            <UploadIcon />
            <span>Upload a video</span>
          </div>
        </Button>
      </div>
    </div>

    <VideoListLoader v-else />
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { computed, watch } from "vue";
import Button from "../buttons/Button.vue";
import VideoList from "../collection/VideoList.vue";
import VideoListLoader from "../collection/VideoListLoader.vue";
import UploadIcon from "../icons/FileUpload.vue";

import { useVideoDBChat } from "../../context";

const { chatInput, loadSession, addMessage } = useVideoDBChat();

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
