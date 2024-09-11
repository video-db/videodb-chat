

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    :class="className"
  >
    <path
      d="M13.2 21.3707C12.54 22.2507 11.46 22.2507 10.8 21.3707L9.29999 19.3707C9.12999 19.1507 8.77 18.9707 8.5 18.9707H8C4 18.9707 2 17.9707 2 12.9707V7.9707C2 3.9707 4 1.9707 8 1.9707H16C20 1.9707 22 3.9707 22 7.9707V12.9707"
      stroke="#343E4F"
      stroke-width="2"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M18.2 21.4C19.9673 21.4 21.4 19.9673 21.4 18.2C21.4 16.4327 19.9673 15 18.2 15C16.4327 15 15 16.4327 15 18.2C15 19.9673 16.4327 21.4 18.2 21.4Z"
      stroke="#343E4F"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22 22L21 21"
      stroke="#343E4F"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15.9945 11H16.0035"
      stroke="#343E4F"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.9945 11H12.0035"
      stroke="#343E4F"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7.99451 11H8.00349"
      stroke="#343E4F"
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
  stroke: currentColor;
}
</style>
