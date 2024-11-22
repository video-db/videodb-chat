<template>
  <div class="vdb-c-flex vdb-c-flex-col vdb-c-gap-4 vdb-c-text-orange-50 vdb-c-break-words">
    Upload
    <a
      :href="ytLink"
      class="vdb-c-text-white vdb-c-underline hover:vdb-c-text-white hover:vdb-c-underline vdb-c-break-all"
      target="black"
    >
      https://youtu.be/Fgr..wo
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
