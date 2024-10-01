<template>
  <div
    class="vdb-c-relative vdb-c-rounded-20 vdb-c-bg-white vdb-c-p-12 vdb-c-py-16 md:vdb-c-p-24"
  >
    <div
      v-if="message.status === 'progress'"
      class="vdb-c-flex vdb-c-items-center vdb-c-gap-8"
    >
      <chat-loader class-name="vdb-c-rotating" />
      <ellipses-loading>Creating a highlight reel</ellipses-loading>
    </div>
    <div
      v-else-if="message.status === 'success' && message.data.stream_url"
      class="vdb-c-w-full"
    >
      <div
        class="vdb-c-mb-20 vdb-c-flex vdb-c-items-center vdb-c-text-subheader vdb-c-font-medium vdb-c-text-steelblue-600"
      >
        <blue-check class-name="vdb-c-mr-8" />
        <span>{{ headingText }}</span>
      </div>
      <div
        class="vdb-c-w-full vdb-c-max-w-512 vdb-c-overflow-hidden vdb-c-rounded-20"
      >
        <VideoDBPlayer
          :stream-url="message.data.stream_url"
          :default-controls="false"
        >
          <template #controls>
            <TimeCode />
          </template>
        </VideoDBPlayer>
      </div>
    </div>
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
import { VideoDBPlayer, TimeCode } from "@videodb/player-vue";
import EllipsesLoading from "../atoms/EllipsesLoading.vue";
import ChatLoader from "../icons/ChatLoader.vue";
import RedExclamation from "../icons/RedExclamation.vue";
import BlueCheck from "../icons/BlueCheck.vue";

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
