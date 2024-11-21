<template>
  <div class="vdb-c-flex vdb-c-flex-col vdb-c-gap-4 vdb-c-text-orange-50">
    Upload
    <a
      :href="ytLink"
      class="vdb-c-text-white hover:vdb-c-text-white hover:vdb-c-underline"
      target="black"
    >
      this video
    </a>
    and generate a bullet point summary.
  </div>
</template>

<script>
export default {
  props: {
    ytLink: {
      type: String,
      default: "https://www.youtube.com/watch?v=FgrO9ADPZSA",
    },
  },
};
</script>
