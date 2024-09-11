
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
      d="M14.0001 10H18.764C20.2508 10 21.2178 11.5646 20.5529 12.8944L17.0529 19.8944C16.7141 20.572 16.0216 21 15.264 21H11.2463C11.0828 21 10.9199 20.9799 10.7612 20.9403L7.00009 20M14.0001 10V5C14.0001 3.89543 13.1047 3 12.0001 3H11.9046C11.4051 3 11.0001 3.40497 11.0001 3.90453C11.0001 4.61883 10.7887 5.31715 10.3924 5.91149L7.00009 11V20M14.0001 10H12.0001M7.00009 20H5.00009C3.89552 20 3.00009 19.1046 3.00009 18V12C3.00009 10.8954 3.89552 10 5.00009 10H7.50009"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
export default {
  name: 'User',
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
  stroke: currentColor;
}
</style>
