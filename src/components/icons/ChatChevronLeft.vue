<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    :class="className"
  >
    <path
      d="M15.8914 13.7914L21 18.9L19.3171 20.5829L14.2085 15.4744L9.09997 20.5829L7.41705 18.9L12.5256 13.7914L7.41709 8.68291L9.1 7L14.2085 12.1085L19.3171 7L21 8.68291L15.8914 13.7914Z"
      fill="#000228"
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

<style>
</style>