<template>
  <div
    v-if="!isSystem"
    :class="[
      'vdb-c-flex vdb-c-h-auto vdb-c-w-full vdb-c-justify-start vdb-c-py-14',
      {
        'vdb-c-border-b vdb-c-border-kilvish-300 vdb-c-bg-white': isUser,
      },
    ]"
  >
    <div class="message-width">
      <!-- #TODO Handle progress, success, error states here-->
      <div v-if="isLoading" class="vdb-c-pb-10 md:vdb-c-p-10">
        <init-loading />
      </div>

      <!-- <template v-if="hasMessageHandler">
        <div
          class="vdb-c-pb-10 md:vdb-c-p-10"
          v-for="(handler, index) in messageHandlers[message.agent_name]"
          :key="index"
        >
          <component
            :is="handler"
            :message="message"
            :search-term="searchTerm"
          />
        </div>
      </template> -->

      <div
        v-if="showText"
        class="vdb-c-w-full vdb-c-transform vdb-c-transition-all"
      >
        <text-response :message="message" :is-user="isUser" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import TextResponse from "../message-handlers/TextResponse.vue";
import InitLoading from "../message-handlers/InitLoading.vue";

import { useVideoDBChat } from "../../context.js";

const props = defineProps({
  message: {
    type: Object,
    default: () => ({}),
  },
  isStaticPage: {
    type: Boolean,
    default: false,
  },
  isLastConv: {
    type: Boolean,
    default: false,
  },
  messageList: {
    type: Array,
    required: true,
  },
  currentIndex: {
    type: Number,
    required: true,
  },
  messageLoading: {
    type: Boolean,
    default: false,
  },
  searchTerm: {
    type: String,
    default: "",
  },
});

// const { messageHandlers, searchTerm } = useVideoDBChat();

const textBool = ref(false);

const isUser = computed(() => props.message.msg_type === "input");
const isAssistant = computed(() => props.message.msg_type === "output");
const isSystem = computed(() => props.message.msg_type === "system");
const isLoading = computed(
  () =>
    props.message.clientLoading ||
    (props.message.status === "progress" && !hasMessageHandler.value),
);
const isFirstMessage = computed(() => props.currentIndex === 1);
const isLastMessage = computed(
  () => props.currentIndex === props.messageList.length - 1,
);
// const lastMessageLoaded = computed(
//   () =>
//     isFirstMessage.value ||
//     props.messageList[props.currentIndex - 1].status !== "progress",
// );

const showText = computed(() =>
  isUser.value ? props.message.content : props.message.content,
);
// const hasRelMoments = computed(() =>
//   props.messageList.some((val) => !!val.search_result),
// );
// const hasMessageHandler = computed(() =>
//   Object.keys(messageHandlers).includes(props.message.agent_name),
// );

// const getImageComponent = computed(() =>
//   typeof (isUser.value ? props.userImage : props.assistantImage) === "object"
//     ? isUser.value
//       ? props.userImage
//       : props.assistantImage
//     : "img",
// );

// const getImageSrc = computed(() =>
//   typeof (isUser.value ? props.userImage : props.assistantImage) === "string"
//     ? isUser.value
//       ? props.userImage
//       : props.assistantImage
//     : undefined,
// );

// watch(
//   showText,
//   (val) => {
//     if (val) {
//       if (props.isStaticPage || isFirstMessage.value || isUser.value) {
//         textBool.value = true;
//       } else {
//         setTimeout(() => {
//           textBool.value = true;
//         }, 500);
//       }
//     }
//   },
//   { immediate: true },
// );
</script>

<style>
.message-width {
  width: 100%;
  max-width: 100%;
}

@media (min-width: 768px) {
  .message-width {
    width: calc(100% - 96px);
    max-width: calc(100% - 96px);
  }
}
</style>
