<template>
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.00033 17.3327C13.6027 17.3327 17.3337 13.6017 17.3337 8.99935C17.3337 4.39698 13.6027 0.666016 9.00033 0.666016C4.39795 0.666016 0.666992 4.39698 0.666992 8.99935C0.666992 13.6017 4.39795 17.3327 9.00033 17.3327ZM9.00033 12.3327C10.8413 12.3327 12.3337 10.8403 12.3337 8.99935C12.3337 7.1584 10.8413 5.66602 9.00033 5.66602C7.15938 5.66602 5.66699 7.1584 5.66699 8.99935C5.66699 10.8403 7.15938 12.3327 9.00033 12.3327Z"
      fill="#0075FF"
    />
  </svg>
</template>

<script>
export default {
  name: "InfoIcon",
  props: {
    fill: {
      type: String,
      default: "#282828",
    },
  },
};
</script>
