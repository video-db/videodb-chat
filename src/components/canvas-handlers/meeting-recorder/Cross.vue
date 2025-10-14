<template>
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <g clip-path="url(#clip0_4190_33272)">
      <path
        d="M19.0838 7.00332L17.6977 5.61719L12.2023 11.1126L6.70693 5.61719L5.3208 7.00332L10.8162 12.4987L5.3208 17.9941L6.70693 19.3802L12.2023 13.8848L17.6977 19.3802L19.0838 17.9941L13.5884 12.4987L19.0838 7.00332Z"
        :fill="fill"
      />
    </g>
    <defs>
      <clipPath id="clip0_4190_33272">
        <rect
          width="23.5938"
          height="23.5938"
          fill="white"
          transform="translate(0.40625 0.703125)"
        />
      </clipPath>
    </defs>
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
