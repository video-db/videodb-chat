<template>
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <path
      d="M16.9064 4.0008V5.5008H15.9064V13.1758L8.79861 6.06805L8.29111 4.99305H7.90636V4.0008H16.9064ZM12.4064 22.2508L11.6564 21.5008V16.0008H7.11786V14.5008L8.90636 12.7123V11.1393L2.53711 4.7393L3.59111 3.68555L20.8371 20.9315L19.7524 21.9853L13.7679 16.0008H13.1564V21.5008L12.4064 22.2508Z"
      fill="currentColor"
      :fill="fill"
    />
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
