<template>
  <div
    v-if="!isSystem"
    class="vdb-c-flex vdb-c-h-auto vdb-c-w-full vdb-c-justify-start vdb-c-px-10 sm:vdb-c-px-20 md:vdb-c-px-40 lg:vdb-c-px-60"
    :class="[
      {
        'vdb-c-mb-10 vdb-c-rounded-t-20 vdb-c-border vdb-c-border-kilvish-300 vdb-c-bg-white':
          isUser,
      },
      { 'vdb-c-flex-col md:vdb-c-flex-row': !isUser },
    ]"
  >
    <div
      class="vdb-c-w-56 vdb-c-min-w-56 vdb-c-p-8"
      :class="{
        'vdb-c-flex vdb-c-items-center vdb-c-justify-center': isUser,
        'vdb-c-hidden md:vdb-c-block': !isUser,
      }"
    >
      <component
        v-if="isUser || (isAssistant && isFirstMessage)"
        :is="getImageComponent"
        :src="getImageSrc"
        :class="[
          'vdb-c-h-40 vdb-c-w-40 vdb-c-rounded-8 vdb-c-object-cover',
          {
            'vdb-c-mt-20 vdb-c-hidden md:vdb-c-block':
              isAssistant && isFirstMessage,
          },
        ]"
      />
    </div>
    <div class="message-width">
      <div v-if="isLoading" class="vdb-c-pb-10 md:vdb-c-p-10">
        <init-loading />
      </div>

      <template v-if="hasMessageHandler">
        <div
          class="vdb-c-pb-10 md:vdb-c-p-10"
          v-for="(handler, index) in messageHandlers[message.agent_type]"
          :key="index"
        >
          <component :is="handler" :message="message" />
        </div>
      </template>

      <div
        v-if="showText"
        class="vdb-c-w-full vdb-c-transform vdb-c-transition-all"
        :class="[
          { 'vdb-c--translate-y-40 vdb-c-opacity-0': !textBool },
          { 'vdb-c-pb-10 md:vdb-c-p-10': textBool && !isUser },
        ]"
      >
        <text-response
          :message="message"
          :is-user="isUser"
          :has-relevant-moments="hasRelMoments"
        />
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
  userImage: {
    type: [String, Object],
    required: true,
  },
  assistantImage: {
    type: [String, Object],
    required: true,
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
});

const { messageHandlers } = useVideoDBChat();

const textBool = ref(false);

const isUser = computed(() => props.message.sender === "user");
const isAssistant = computed(() => props.message.sender === "assistant");
const isSystem = computed(() => props.message.sender === "system");
const isLoading = computed(
  () =>
    props.message.clientLoading ||
    (props.message.status === "progress" && !hasMessageHandler.value),
);
const isFirstMessage = computed(() => props.currentIndex === 1);
const isLastMessage = computed(
  () => props.currentIndex === props.messageList.length - 1,
);
const lastMessageLoaded = computed(
  () =>
    isFirstMessage.value ||
    props.messageList[props.currentIndex - 1].status !== "progress",
);

const showText = computed(() =>
  isUser.value
    ? props.message.content
    : props.message.content && lastMessageLoaded.value,
);
const hasRelMoments = computed(() =>
  props.messageList.some((val) => !!val.search_result),
);
const hasMessageHandler = computed(() =>
  Object.keys(messageHandlers).includes(props.message.agent_type),
);

const getImageComponent = computed(() =>
  typeof (isUser.value ? props.userImage : props.assistantImage) === "object"
    ? isUser.value
      ? props.userImage
      : props.assistantImage
    : "img",
);

const getImageSrc = computed(() =>
  typeof (isUser.value ? props.userImage : props.assistantImage) === "string"
    ? isUser.value
      ? props.userImage
      : props.assistantImage
    : undefined,
);

watch(
  showText,
  (val) => {
    if (val) {
      if (props.isStaticPage || isFirstMessage.value || isUser.value) {
        textBool.value = true;
      } else {
        setTimeout(() => {
          textBool.value = true;
        }, 500);
      }
    }
  },
  { immediate: true },
);
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
