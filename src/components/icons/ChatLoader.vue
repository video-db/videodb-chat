<template>
  <svg
    :class="className"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M18.5 10C18.5 11.6811 18.0015 13.3245 17.0675 14.7223C16.1335 16.1202 14.806 17.2096 13.2528 17.853C11.6996 18.4963 9.99057 18.6646 8.34173 18.3367C6.69289 18.0087 5.17834 17.1992 3.98959 16.0104C2.80085 14.8217 1.9913 13.3071 1.66333 11.6583C1.33535 10.0094 1.50368 8.30036 2.14702 6.74719C2.79037 5.19402 3.87984 3.8665 5.27765 2.93251C6.67547 1.99852 8.31886 1.5 10 1.5"
      stroke="url(#paint0_angular_2739_3202)"
      stroke-width="3"
      stroke-linecap="round"
    />
    <defs>
      <radialGradient
        id="paint0_angular_2739_3202"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(10 10) rotate(-84.2894) scale(10.0499)"
      >
        <stop offset="0.0234114" stop-color="#FFC130" stop-opacity="0" />
        <stop offset="0.291667" stop-color="#E1A325" stop-opacity="0" />
        <stop offset="1" stop-color="#FFC130" />
      </radialGradient>
    </defs>
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
.vdb-c-rotating {
  animation: vdb-c-rotate 1s linear infinite;
}

@keyframes vdb-c-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
