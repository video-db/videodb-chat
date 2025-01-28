<template>
  <transition name="slide-down">
    <div v-if="visible" class="success-banner" role="alert">
      <div class="icon-text">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM15.7071 10.7071C16.0976 10.3166 16.0976 9.68342 15.7071 9.29289C15.3166 8.90237 14.6834 8.90237 14.2929 9.29289L11 12.5858L9.70711 11.2929C9.31658 10.9024 8.68342 10.9024 8.29289 11.2929C7.90237 11.6834 7.90237 12.3166 8.29289 12.7071L10.2929 14.7071C10.6834 15.0976 11.3166 15.0976 11.7071 14.7071L15.7071 10.7071Z"
            fill="#0AA910"
          />
        </svg>
        <span>{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from "vue";
const props = defineProps({
  message: {
    type: String,
    default: "Action completed successfully.",
  },
  duration: {
    type: Number,
    default: 5000,
  },
});
const emit = defineEmits(["hide"]);
const visible = ref(false);
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      visible.value = true;
      setTimeout(() => {
        visible.value = false;
        emit("hide");
      }, props.duration);
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.success-banner {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #e6f6e7;
  color: black;
  border: 1px solid #0aa910;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  z-index: 1000;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
/* Icon next to the text */
.icon-text {
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon {
  width: 20px;
  height: 20px;
  color: #0aa910;
}
/* Slide-down animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
