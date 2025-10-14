<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    :class="className"
  >
    <path
      d="M15.9062 12.7115L17.6947 14.5V16H13.1562V21.5L12.4062 22.25L11.6562 21.5V16H7.11768V14.5L8.90618 12.7115V5.5H7.90618V4H16.9062V5.5H15.9062V12.7115ZM9.25618 14.5H15.5562L14.4062 13.35V5.5H10.4062V13.35L9.25618 14.5Z"
      fill="currentColor"
      :fill="fill"
    />
  </svg>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: "",
  },
  fill: {
    type: String,
    default: "currentColor",
  },
});
</script>

<style scoped></style>
