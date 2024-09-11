<template>
  <svg
    :class="className"
    width="580"
    height="580"
    viewBox="0 0 580 580"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_611_2078)">
      <rect width="580" height="580" rx="110" fill="#E9EEF2" />
      <path
        d="M251.5 315.667C216.062 315.667 187.333 344.395 187.333 379.833C187.333 401.096 204.57 418.333 225.833 418.333H354.167C375.43 418.333 392.667 401.096 392.667 379.833C392.667 344.395 363.938 315.667 328.5 315.667H251.5Z"
        fill="#4D7797"
      />
      <path
        d="M290 161.667C254.562 161.667 225.833 190.395 225.833 225.833C225.833 261.272 254.562 290 290 290C325.438 290 354.167 261.272 354.167 225.833C354.167 190.395 325.438 161.667 290 161.667Z"
        fill="#4D7797"
      />
    </g>
    <rect
      x="19"
      y="19"
      width="542"
      height="542"
      rx="91"
      stroke="#D2DDE5"
      stroke-width="38"
    />
    <defs>
      <clipPath id="clip0_611_2078">
        <rect width="580" height="580" rx="110" fill="white" />
      </clipPath>
    </defs>
  </svg>
</template>
<script>
export default {
  name: "RightArrow",
  props: {
    className: {
      type: String,
      default: "",
    },
  },
};
</script>
