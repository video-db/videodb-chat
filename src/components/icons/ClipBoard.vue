
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    :class="className"
  >
    <path
      d="M6.00016 3.33333H4.66683C3.93045 3.33333 3.3335 3.93029 3.3335 4.66667V12.6667C3.3335 13.403 3.93045 14 4.66683 14H11.3335C12.0699 14 12.6668 13.403 12.6668 12.6667V4.66667C12.6668 3.93029 12.0699 3.33333 11.3335 3.33333H10.0002M6.00016 3.33333C6.00016 4.06971 6.59712 4.66667 7.3335 4.66667H8.66683C9.40321 4.66667 10.0002 4.06971 10.0002 3.33333M6.00016 3.33333C6.00016 2.59695 6.59712 2 7.3335 2H8.66683C9.40321 2 10.0002 2.59695 10.0002 3.33333"
      stroke="#20557D"
      stroke-width="1.5"
      stroke-linecap="round"
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
