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
        v-if="message.status === 'success'"
        class="vdb-c-grid vdb-c-grid-cols-2 vdb-c-gap-4 sm:vdb-c-grid-cols-3 md:vdb-c-grid-cols-4"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="vdb-c-aspect-w-1 vdb-c-aspect-h-1 vdb-c-overflow-hidden vdb-c-rounded-lg vdb-c-shadow-md"
        >
          <img
            :src="image.url"
            :alt="`Generated image ${index + 1}`"
            class="vdb-c-h-full vdb-c-w-full vdb-c-object-cover"
          />
        </div>
      </div>
      <div
        v-else-if="message.status === 'progress'"
        class="vdb-c-grid vdb-c-grid-cols-2 vdb-c-gap-4 sm:vdb-c-grid-cols-3 md:vdb-c-grid-cols-4"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="vdb-c-aspect-w-1 vdb-c-aspect-h-1 vdb-c-animate-pulse vdb-c-rounded-lg vdb-c-bg-gray-200"
        ></div>
      </div>
      <div
        v-else-if="message.status === 'error'"
        class="vdb-c-flex vdb-c-flex-col"
      >
        <p class="vdb-c-text-red-500">Error loading images.</p>
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
});

const images = computed(() => props.message.images || []);
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
