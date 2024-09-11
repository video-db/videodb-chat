
<template>
  <svg
    :class="className"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M21 10H11C6.58172 10 3 13.5817 3 18V20M21 10L15 16M21 10L15 4"
      stroke="#111827"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
svg path {
  fill: currentColor;
}
</style>
