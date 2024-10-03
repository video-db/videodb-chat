<template>
  <div
    class="vdb-c-flex vdb-c-cursor-pointer vdb-c-items-center vdb-c-rounded-lg vdb-c-border-2 vdb-c-border-[#EFEFEF]"
  >
    <div class="flex items-center justify-center vdb-c-rounded-full vdb-c-p-12">
      <slot name="icon"></slot>
    </div>
    <div class="vdb-c-border-l vdb-c-border-[#EFEFEF] vdb-c-p-12 vdb-c-flex vdb-c-flex-col vdb-c-gap-4">
      <h4 class="vdb-c-font-semibold vdb-c-text-[#1D2736]">
        <slot name="name"></slot>
      </h4>
      <p class="vdb-c-text-sm vdb-c-text-[#1E1E1E]">
        <slot name="description"></slot>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ButtonCard",
};
</script>
