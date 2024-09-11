
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
      d="M10.3788 11.8212L6 16.2L7.4425 17.6425L11.8213 13.2637L16.2 17.6425L17.6425 16.2L13.2638 11.8212L17.6425 7.4425L16.2 6L11.8213 10.3787L7.44253 6L6.00003 7.4425L10.3788 11.8212Z"
      fill="#343E4F"
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
</style>
