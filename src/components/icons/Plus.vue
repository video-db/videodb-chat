<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="black"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="icon"
    :class="customClass"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  strokeWidth: {
    type: [String, Number],
    default: 2,
  },
  customClass: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: middle;
}
</style>
