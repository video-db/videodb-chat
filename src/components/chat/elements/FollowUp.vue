<template>
  <div
    tabindex="-1"
    class="vdb-c-followup vdb-c-border vdb-c-border-solid vdb-c-cursor-pointer vdb-c-bg-superman-100 vdb-c-border-steelblue-800 vdb-c-text-steelblue hover:vdb-c-bg-steelblue-200 vdb-c-text-sm vdb-c-font-medium vdb-c-p-8 vdb-c-rounded-6"
    @click="$emit('onClick')"
  >
    {{ content }}
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true,
    },
  },
}
</script>

<style>
</style>