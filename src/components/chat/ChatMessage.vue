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
      <div
        v-if="isUser"
        class="vdb-c-w-full vdb-c-transform vdb-c-transition-all"
      >
        <!--TODO: don't hardcode to first element-->
        <text-response :message="message.content[0]" :is-user="true" />
      </div>

      <div v-else-if="isAssistant">
        <div class="vdb-c-flex vdb-c-flex-col vdb-c-gap-8">
          <div class="vdb-c-py-14">
            <ChatMessageSteps
              :steps="message.actions"
              :status="message.status"
              :is-last-conv="isLastConv"
            />
          </div>

          <div v-for="content in message.content">
            <component
              v-if="Object.keys(messageHandlers).includes(content.type)"
              :is="messageHandlers[content.type]"
              :is-last-conv="isLastConv"
              :message="content"
              :is-user="isUser"
              :search-term="searchTerm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import TextResponse from "../message-handlers/TextResponse.vue";
import ChatMessageSteps from "./elements/ChatMessageSteps.vue";

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
  isLastConv: {
    type: Boolean,
    default: false,
  },
});

const { messageHandlers } = useVideoDBChat();

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
const hasMessageHandler = computed(() =>
  Object.keys(messageHandlers).includes(props.message.content_type),
);

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
    width: 98%;
    max-width: 98%;
  }
}
</style>
