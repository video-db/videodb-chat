<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="vdb-c-text-left vdb-c-relative vdb-c-w-full vdb-c-rounded-20 vdb-c-bg-white vdb-c-p-12 md:vdb-c-p-24"
    :class="{
      'vdb-c-border vdb-c-border-primary': isErrored,
      'vdb-c-py-16': !isUser,
    }"
  >
    <p
      v-if="message.status === 'progress'"
      class="vdb-c-flex vdb-c-items-center vdb-c-gap-8 vdb-c-pl-8"
    >
      <chat-loader class-name="vdb-c-rotating" />
      <ellipses-loading>Putting together a few words</ellipses-loading>
    </p>
    <div v-else-if="showMarkdown" class="vdb-c-flex vdb-c-flex-col">
      <div
        v-show="isMainResponse"
        class="vdb-c-mb-8 vdb-c-flex vdb-c-items-center vdb-c-text-subheader vdb-c-font-medium vdb-c-text-steelblue-600"
      >
        <blue-check class-name="vdb-c-mr-8" />
        {{ headingText }}
      </div>
      <p
        ref="markdownContainer"
        class="vdb-c-markdown-body vdb-c-overflow-hidden vdb-c-text-kilvish-900"
        :class="{
          [containerMaxHeight]:
            showReadMore && !isExpanded && isMainResponse && !isUser,
          'vdb-c-pb-48': isExpanded && isMainResponse,
          'vdb-c-font-semibold': isUser,
        }"
        v-html="getMarkedMsg(text)"
      ></p>
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
    <p v-else-if="isErrored" class="vdb-c-flex vdb-c-text-primary">
      <red-exclamation />

      <span class="vdb-c-ml-8 vdb-c-inline-block"
        >There was an error in generating this response.</span
      >
    </p>
    <div
      v-show="isMainResponse && message.status === 'success'"
      class="vdb-c-absolute vdb-c-bottom-12 vdb-c-left-0 vdb-c-flex vdb-c-w-full vdb-c-items-end vdb-c-justify-center vdb-c-gap-16 md:vdb-c-bottom-24"
      :class="{
        'vdb-c-readMoreGradient vdb-c-h-72 vdb-c-rounded-b-20':
          showReadMore && !isExpanded,
      }"
    >
      <button
        v-show="showReadMore && !isExpanded"
        class="vdb-c-flex vdb-c-cursor-pointer vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-border vdb-c-border-steelblue vdb-c-bg-white vdb-c-px-12 vdb-c-py-8 vdb-c-font-semibold vdb-c-text-steelblue hover:vdb-c-bg-steelblue-200"
        @click="setExpanded(true)"
      >
        Read More
        <down-arrow class-name="vdb-c-ml-8" />
      </button>
      <button
        class="vdb-c-flex vdb-c-cursor-pointer vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-border vdb-c-border-steelblue vdb-c-px-12 vdb-c-py-8 vdb-c-font-semibold"
        :class="{
          'vdb-c-bg-steelblue vdb-c-text-white': isCopied,
          'vdb-c-bg-white vdb-c-text-steelblue hover:vdb-c-bg-steelblue-200':
            !isCopied,
        }"
        @click="onCopy"
      >
        {{ !isCopied ? "Copy Text" : "Copied" }}
        <clip-board v-if="!isCopied" class-name="vdb-c-ml-8" />
        <clip-board-done v-else class-name="vdb-c-ml-8" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { parse } from "marked";
import EllipsesLoading from "../atoms/EllipsesLoading.vue";
import RedExclamation from "../icons/RedExclamation.vue";
import ClipBoard from "../icons/ClipBoard.vue";
import ClipBoardDone from "../icons/ClipBoardDone.vue";
import ChatLoader from "../icons/ChatLoader.vue";
import DownArrow from "../icons/DownArrow.vue";
import BlueCheck from "../icons/BlueCheck.vue";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isUser: {
    type: Boolean,
    default: false,
  },
  hasRelevantMoments: {
    type: Boolean,
    default: false,
  },
  mediaTypesObject: {
    type: Object,
    default: () => ({}),
  },
});

const isCopied = ref(false);
const isExpanded = ref(false);
const markdownContainer = ref(null);

const isMainResponse = computed(
  () =>
    props.message.status === "success" &&
    props.message.content &&
    !props.message.agent_type,
);
const isExpandable = computed(() => isMainResponse.value);
const showReadMore = computed(
  () => isMainResponse.value && text.value.length > 400,
);
const text = computed(() => props.message.content);
const isErrored = computed(
  () => props.message.status === "error" || !text.value,
);
const showMarkdown = computed(
  () =>
    (props.message.status === "success" || !props.message.status) && text.value,
);
const headingText = computed(() => "Your response is ready. Here you go!");
const containerMaxHeight = computed(() =>
  props.hasRelevantMoments ? "vdb-c-max-h-288" : "vdb-c-max-h-182",
);

watch(
  showReadMore,
  (val) => {
    if (!val) {
      isExpanded.value = true;
    }
  },
  { immediate: true },
);

watch(showMarkdown, (val) => {
  if (val) {
    nextTick(() => {
      const mc = markdownContainer.value;
      if (!mc) return;
      const as = mc.getElementsByTagName("a");
      for (let i = 0; i < as.length; i++) {
        const elm = as[i];
        elm.setAttribute("target", "_blank");
      }
    });
  }
});

const getMarkedMsg = (msg) => {
  if (props.mediaTypesObject) {
    let unionMediaTypes = {};
    Object.values(props.mediaTypesObject).forEach((callType) => {
      unionMediaTypes = { ...unionMediaTypes, ...callType.default };
    });
    if (unionMediaTypes[msg]) {
      return parse(unionMediaTypes[msg].name);
    } else return parse(msg);
  }

  return parse(msg);
};

const onCopy = () => {
  if (isCopied.value) return;
  navigator.clipboard.writeText(text.value);
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 5000);
};

const setExpanded = (val) => {
  isExpanded.value = val;
};
</script>

<style>
.vdb-c-readMoreGradient {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 1) 100%
  );
}
</style>
