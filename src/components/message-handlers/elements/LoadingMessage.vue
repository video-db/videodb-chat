<template>
  <div class="vdb-c-flex vdb-c-items-center vdb-c-space-x-2">
    <transition name="fade" mode="out-in">
      <span
        v-if="status === 'progress'"
        class="vdb-c-text-gray-500"
        key="progress"
      >
        <transition name="fade" mode="out-in">
          <span :key="message">{{ message }}</span>
        </transition>
      </span>
      <span
        v-else-if="status === 'success'"
        class="vdb-c-flex vdb-c-items-center vdb-c-gap-8 vdb-c-font-bold vdb-c-text-[#C14103]"
        key="success"
      >
        <CheckIcon class="bounce" />
        {{ message }}
      </span>
    </transition>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from "vue";
import CheckIcon from "../../icons/Check.vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ["progress", "success"].includes(value),
  },
  message: {
    type: String,
    required: true,
  },
});

const messageKey = ref(0);

watch(() => props.message, () => {
  if (props.status === 'progress') {
    messageKey.value++;
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.bounce {
  display: inline-block;
  animation: bounce-in 0.5s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
