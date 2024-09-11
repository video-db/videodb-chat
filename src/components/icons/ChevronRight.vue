
<template>
  <div>
    <svg
      :class="className"
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
    >
      <path
        d="M4.90948 6.07292L0.666748 1.66531L1.87871 0.40625L7.33341 6.07292L1.87871 11.7396L0.666748 10.4805L4.90948 6.07292Z"
        fill="#000228"
      />
    </svg>
  </div>
</template>
<script>
export default {
  name: 'RightArrow',
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
