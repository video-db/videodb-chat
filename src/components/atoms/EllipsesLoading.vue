<template>
  <span>
    <slot />
    <span class="vdb-c-ellipses_container">
      <span class="vdb-c-one">.</span>
      <span class="vdb-c-two">.</span>
      <span class="vdb-c-three">.</span>
    </span>
  </span>
</template>

<script>
export default {
  name: 'EllipsesLoading',
}
</script>

<style scoped>
.vdb-c-ellipses_container {
  letter-spacing: -0.1em;
}

.vdb-c-one {
  opacity: 0;
  -webkit-animation: dot 1.3s infinite;
  -webkit-animation-delay: 0s;
  animation: dot 1.3s infinite;
  animation-delay: 0s;
}

.vdb-c-two {
  opacity: 0;
  -webkit-animation: dot 1.3s infinite;
  -webkit-animation-delay: 0.2s;
  animation: dot 1.3s infinite;
  animation-delay: 0.2s;
}

.vdb-c-three {
  opacity: 0;
  -webkit-animation: dot 1.3s infinite;
  -webkit-animation-delay: 0.3s;
  animation: dot 1.3s infinite;
  animation-delay: 0.3s;
}

@-webkit-keyframes dot {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes dot {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>