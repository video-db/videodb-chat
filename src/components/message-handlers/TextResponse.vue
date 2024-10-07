<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="vdb-c-relative vdb-c-w-full vdb-c-rounded-20 vdb-c-bg-white vdb-c-py-14 vdb-c-text-left"
  >
    <div v-if="showMarkdown" class="vdb-c-flex vdb-c-flex-col">
      <!-- <div
        v-show="showHeadingText"
        class="vdb-c-mb-8 vdb-c-flex vdb-c-items-center vdb-c-text-subheader vdb-c-font-medium vdb-c-text-steelblue-600"
      >
        <blue-check class-name="vdb-c-mr-8" />
        {{ headingText }}
      </div> -->
      <p
        ref="markdownContainer"
        :class="[
          'markdown-body vdb-c-overflow-hidden vdb-c-text-kilvish-900',
          isUser ? 'vdb-c-font-semibold' : 'vdb-c-font-normal',
        ]"
        v-html="getMarkedMsg(text)"
      ></p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { parse } from "marked";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isUser: {
    type: Boolean,
    default: false,
  },
  mediaTypesObject: {
    type: Object,
    default: () => ({}),
  },
});

const markdownContainer = ref(null);
const showMarkdown = computed(() => props.message.data.content);
const text = computed(() => props.message.data.content);

const getMarkedMsg = (msg) => {
  return parse(msg);
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
