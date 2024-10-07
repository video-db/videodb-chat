<template>
  <div class="vdb-c-relative vdb-c-rounded-20 vdb-c-bg-white">
    <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-8">
      <!-- <LoadingMessage status= message="Creating a highlight reel" /> -->
    </div>
    <div
      v-if="message.status === 'success' && message.data.stream_url"
      class="vdb-c-w-full"
    >
      <div
        class="vdb-c-mb-20 vdb-c-flex vdb-c-items-center vdb-c-text-subheader vdb-c-font-medium vdb-c-text-steelblue-600"
      >
        <blue-check class-name="vdb-c-mr-8" />
        <span>{{ headingText }}</span>
      </div>
      <div
        class="vdb-c-full xl:vdb-c-1/2 vdb-c-overflow-hidden vdb-c-rounded-20 sm:vdb-c-w-3/4 lg:vdb-c-w-3/5 xl:vdb-c-w-1/2 2xl:vdb-c-w-1/3"
      >
        <VideoDBPlayer
          :stream-url="message.data.stream_url"
          :default-controls="false"
        >
          <template #controls>
            <div class="vdb-p-pt-0 vdb-c-p-20">
              <div class="sm:vdb-p-mx-8 vdb-c-mb-12">
                <ProgressBar :stream-url="streamUrl" />
              </div>
              <div class="vdb-c-flex vdb-c-w-full vdb-c-justify-between">
                <div
                  class="vdb-c-z-10 vdb-c-ml-0 vdb-c-flex vdb-c-items-center"
                >
                  <PlayPauseButton />
                  <TimeCode />
                </div>

                <div
                  class="vdb-c-flex vdb-c-w-auto vdb-c-flex-row vdb-c-items-center"
                >
                  <FullScreenButton />
                </div>
              </div>
            </div>
          </template>
        </VideoDBPlayer>
      </div>
    </div>
    <div v-else-if="message.status === 'progress'"></div>
    <div
      v-else-if="message.status === 'not_generated'"
      class="vdb-c-flex vdb-c-flex-col"
    >
      <div
        class="vdb-c-mb-8 vdb-c-flex vdb-c-text-subheader vdb-c-text-steelblue-600"
      >
        No relevant results were found
      </div>
      <p class="vdb-c-markdown-body vdb-c-text-kilvish-900">
        Couldn't find any matching results for your query. Try searching for
        something else?
      </p>
    </div>
    <p
      v-else-if="message.status === 'error' || !message.data.stream_url"
      class="vdb-c-flex vdb-c-text-primary"
    >
      <red-exclamation />

      <span class="vdb-c-ml-8 vdb-c-inline-block"
        >There was an error in generating this response.
      </span>
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  VideoDBPlayer,
  TimeCode,
  PlayPauseButton,
  VolumeControlButton,
  CaptionButton,
  SpeedControlButton,
  FullScreenButton,
  ProgressBar,
} from "@videodb/player-vue";
import EllipsesLoading from "../atoms/EllipsesLoading.vue";
import ChatLoader from "../icons/ChatLoader.vue";
import RedExclamation from "../icons/RedExclamation.vue";
import BlueCheck from "../icons/BlueCheck.vue";
// import LoadingMessage from "../message-handlers/elements/LoadingMessage.vue";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const headingText = computed(() => "Here's a compilation of relevant moments");
</script>

<style lang="scss">
.video-js .vjs-big-play-button {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
