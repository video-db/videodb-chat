<template>
  <transition name="slide-down">
    <div v-if="visible" class="success-banner" role="alert">
      <div class="icon-text">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          class="icon"
        >
          <path
            d="M9 3H15V4H20V6H4V4H9V3ZM6 8V19C6 19.55 6.45 20 7 20H17C17.55 20 18 19.55 18 19V8H6ZM10 10H11V17H10V10ZM13 10H14V17H13V10Z"
          />
        </svg>
        <span>{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";
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
  { immediate: true }
);
</script>

<style scoped>
.success-banner {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FBE5E5;
  color: black;
  border: 1px solid #E2462C;
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
  color: #E2462C;
}
/* Slide-down animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
