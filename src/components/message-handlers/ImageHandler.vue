<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="vdb-c-relative vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-gap-8 vdb-c-bg-white vdb-c-py-14 vdb-c-text-left"
  >
    <LoadingMessage
      v-if="!isUser"
      :status="message.status"
      :message="message.status_message"
      :isLastConv="isLastConv"
    />

    <transition name="fade" mode="out-in">
      <div
        v-if="message.status === 'success'"
        class="vdb-c-shadow-md vdb-c-overflow-hidden"
      >
        <img
          :src="image.url"
          :alt="'Generated image'"
          class="vdb-c-h-auto vdb-c-w-1/2 vdb-c-rounded-lg"
        />
      </div>
      <div
        v-else-if="message.status === 'progress'"
        class="vdb-c-animate-pulse vdb-c-rounded-lg vdb-c-bg-gray-200"
      ></div>
      <div
        v-else-if="message.status === 'error'"
        class="vdb-c-flex vdb-c-flex-col"
      >
        <p class="vdb-c-text-red-500">Error loading image.</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from "vue";
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
  isLastConv: {
    type: Boolean,
    required: true,
  },
});

const image = computed(() => props.message.image || {});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
