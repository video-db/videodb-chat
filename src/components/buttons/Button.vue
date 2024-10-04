<template>
  <button
    :class="[
      'vdb-c-flex vdb-c-rounded-lg vdb-c-px-16 vdb-c-py-8 vdb-c-transition-colors vdb-c-duration-300 vdb-c-ease-in-out',
      {
        'vdb-c-bg-black vdb-c-text-white hover:vdb-c-bg-[#2D2D2D]':
          variant === 'primary',
        'vdb-c-border vdb-c-border-[#D9D9D9] vdb-c-bg-white vdb-c-text-black hover:vdb-c-border-[#464646] hover:vdb-c-bg-[#464646] hover:vdb-c-text-white':
          variant === 'secondary',
        'vdb-c-bg-[#EC5B16] vdb-c-text-white hover:vdb-c-bg-[#FF7E32]':
          variant === 'tertiary',
      },
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "secondary", "tertiary"].includes(value),
  },
});
</script>
