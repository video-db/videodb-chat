<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="vdb-c-relative vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-gap-8 vdb-c-bg-white vdb-c-py-14 vdb-c-text-left"
  >
    <LoadingMessage
      v-if="!isUser"
      :status="message.status"
      :message="message.status_message"
    />

    <transition name="fade" mode="out-in">
      <div
        v-if="message.status === 'success' || isUser"
        class="vdb-c-flex vdb-c-flex-col"
      >
        <p
          :class="[
            'markdown-body vdb-c-overflow-hidden vdb-c-text-kilvish-900',
            isUser ? 'vdb-c-font-semibold' : 'vdb-c-font-normal',
          ]"
          v-html="getMarkedMsg(text)"
        ></p>
      </div>
      <div
        v-else-if="message.status === 'progress'"
        class="vdb-c-flex-start vdb-c-flex vdb-c-flex-col"
      >
        <div
          class="vdb-c-mb-2 vdb-c-h-16 vdb-c-w-3/4 vdb-c-animate-pulse vdb-c-rounded vdb-c-bg-gray-200"
        ></div>
        <div
          class="vdb-c-mb-2 vdb-c-h-16 vdb-c-w-1/2 vdb-c-animate-pulse vdb-c-rounded vdb-c-bg-gray-200"
        ></div>
        <div
          class="vdb-c-h-16 vdb-c-w-2/3 vdb-c-animate-pulse vdb-c-rounded vdb-c-bg-gray-200"
        ></div>
      </div>
      <div
        v-else-if="message.status === 'error'"
        class="vdb-c-flex vdb-c-flex-col"
      ></div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { parse } from "marked";
import LoadingMessage from "./elements/LoadingMessage.vue";

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

const text = computed(() => props.message.text);

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
