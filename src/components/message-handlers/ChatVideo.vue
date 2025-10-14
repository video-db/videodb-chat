<template>
  <div
    class="vdb-c-relative vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-gap-8 vdb-c-py-14 vdb-c-text-left"
  >
    <LoadingMessage
      :status="content.status"
      :message="content.status_message"
      :is-last-conv="isLastConv"
    />
    <transition name="fade" mode="out-in">
      <div
        v-if="content.status === 'success' && content.video.stream_url"
        class="vdb-c-w-full vdb-c-py-6"
      >
        <div
          :class="
            isFullScreen
              ? 'vdb-c-fixed vdb-c-inset-0 vdb-c-z-50 vdb-c-flex vdb-c-h-full vdb-c-w-full vdb-c-flex-col vdb-c-items-center vdb-c-justify-center vdb-c-overflow-y-hidden vdb-c-bg-black-64'
              : 'vdb-c-full xl:vdb-c-1/2 vdb-c-overflow-hidden vdb-c-rounded-20 sm:vdb-c-w-3/4 lg:vdb-c-w-3/5 xl:vdb-c-w-1/2'
          "
        >
          <VideoDBPlayer
            :class="isFullScreen ? 'vdb-c-h-screen vdb-c-w-screen' : ''"
            :stream-url="content.video.stream_url"
            :default-controls="false"
            :default-overlay="false"
            @fullScreenChange="handleFullScreenChange"
          >
            <template #overlay>
              <BigCenterButton
                class="vdb-c-absolute vdb-c-left-1/2 vdb-c-top-1/2 vdb-c-h-32 vdb-c-w-32 md:vdb-c-h-48 md:vdb-c-w-48"
              />
              <!-- Share Button -->
              <button
                @click="copyShareUrl"
                class="vdb-c-hover:bg-gray-50 vdb-c-absolute vdb-c-right-16 vdb-c-top-16 vdb-c-flex vdb-c-items-center vdb-c-gap-8 vdb-c-rounded-lg vdb-c-bg-white vdb-c-px-10 vdb-c-py-6 vdb-c-text-sm vdb-c-font-medium vdb-c-text-black hover:vdb-c-shadow-lg vdb-c-transition-all vdb-c-duration-200"
              >
                <ExternalLink class="vdb-c-h-16 vdb-c-w-16" />
                Share
              </button>
              <!-- Success Message -->
              <transition name="fade">
                <div
                  v-if="showSuccessMessage"
                  class="vdb-c-absolute vdb-c-right-16 vdb-c-top-16 vdb-c-rounded-lg vdb-c-bg-green-500 vdb-c-px-10 vdb-c-py-6 vdb-c-text-sm vdb-c-font-medium vdb-c-text-white vdb-c-shadow-lg"
                >
                  Share URL copied!
                </div>
              </transition>
            </template>
            <template #controls>
              <div class="vdb-p-pt-0 vdb-c-p-20">
                <div class="sm:vdb-p-mx-8 vdb-c-mb-8 md:vdb-c-mb-12">
                  <ProgressBar :stream-url="content.video.stream_url" />
                </div>
                <div class="vdb-c-flex vdb-c-w-full vdb-c-justify-between">
                  <div
                    class="vdb-c-z-10 vdb-c-ml-0 vdb-c-flex vdb-c-items-center"
                  >
                    <PlayPauseButton />
                    <VolumeControlButton />
                    <TimeCode />
                  </div>

                  <FullScreenButton class="" />
                </div>
              </div>
            </template>
          </VideoDBPlayer>
        </div>
      </div>
      <div v-else-if="content.status === 'progress'">
        <div
          class="vdb-c-full xl:vdb-c-1/2 vdb-c-animate-pulse vdb-c-overflow-hidden vdb-c-rounded-20 sm:vdb-c-w-3/4 lg:vdb-c-w-3/5 xl:vdb-c-w-1/2"
        >
          <div class="vdb-c-relative vdb-c-w-full" style="padding-top: 56.25%">
            <div
              class="vdb-c-absolute vdb-c-inset-0 vdb-c-flex vdb-c-items-center vdb-c-justify-center vdb-c-bg-gray-200"
            ></div>
          </div>
        </div>
      </div>
      <div
        v-else-if="content.status === 'not_generated'"
        class="vdb-c-flex vdb-c-flex-col"
      ></div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  VideoDBPlayer,
  TimeCode,
  BigCenterButton,
  VolumeControlButton,
  PlayPauseButton,
  FullScreenButton,
  ProgressBar,
} from "@videodb/player-vue";
import "@videodb/player-vue/dist/style.css";
import LoadingMessage from "./elements/LoadingMessage.vue";
import ExternalLink from "../icons/ExternalLink.vue";

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
  isLastConv: {
    type: Boolean,
    default: false,
  },
});

const isFullScreen = ref(false);
const showSuccessMessage = ref(false);

const handleFullScreenChange = () => {
  isFullScreen.value = !isFullScreen.value;
  if (isFullScreen.value) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

const copyShareUrl = async () => {
  try {
    const shareUrl = `https://console.videodb.io/player?url=${props.content.video.stream_url}`;
    await navigator.clipboard.writeText(shareUrl);

    // Show success message
    showSuccessMessage.value = true;

    // Hide success message after 2 seconds
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy share URL:", err);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = `https://console.videodb.io/player?url=${props.content.video.stream_url}`;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    // Show success message even for fallback
    showSuccessMessage.value = true;
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 2000);
  }
};

</script>

<style lang="scss">
.video-js .vjs-big-play-button {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
