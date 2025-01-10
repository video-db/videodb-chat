<template>
  <div class="vdb-c-flex vdb-c-flex-col vdb-c-gap-8">
    <h1
      class="vdb-c-flex vdb-c-items-center vdb-c-gap-4 vdb-c-text-xl vdb-c-leading-tight sm:vdb-c-text-3xl md:vdb-c-text-5xl"
      :style="{ lineHeight: '1.2' }"
    >
      <div
        :class="['header', { 'chat-header': isChatScreen }]"
        class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between"
        style="flex-wrap: nowrap;"
      >
        <div
          class="vdb-c-flex vdb-c-items-center"
          style="gap: 4px; flex-shrink: 1;"
        >
          <span
            class="vdb-c-inline-block vdb-c-max-w-[80%] md:vdb-c-max-w-[100%]"
            :class="[isChatScreen ? 'vdb-c-font-bold vdb-c-text-black' : 'vdb-c-font-extrabold vdb-c-text-orange']"
            :title="collectionName"
          >
            {{ collectionName }}
          </span>
          <span
            v-if="videoName"
            class="video-name vdb-c-text-sm vdb-c-text-black md:vdb-c-text-base"
          >
            > {{ videoName }}
          </span>
        </div>
        <Button
          v-if="headerConfig.uploadButton"
          @click="$emit('upload-button-click')"
          variant="tertiary"
          class="!vdb-c-px-8 !vdb-c-py-10"
        >
          <div
            class="vdb-c-flex vdb-c-items-center vdb-c-gap-6 vdb-c-text-sm vdb-c-font-medium"
          >
            <UploadIcon
              class="vdb-c-hidden vdb-c-h-20 vdb-c-w-20 md:vdb-c-block"
            />
            <span class="vdb-c-flex vdb-c-flex-row vdb-c-gap-4">
              Upload Video
            </span>
          </div>
        </Button>
      </div>
    </h1>
  </div>
</template>

<script setup>
import Button from "../../buttons/Button.vue";
import UploadIcon from "../../icons/FileUpload.vue";

const props = defineProps({
  collectionName: {
    type: String,
    default: "Default Collection",
  },
  videoName: {
    type: String,
    default: null,
  },
  isChatScreen: {
    type: Boolean,
    default: false,
  },
  headerConfig: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(["upload-button-click"]);
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
}

.chat-header {
  color: black;
}

.collection-name {
  font-size: 48px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-name {
  font-size: 40px;
  font-weight: normal;
  margin-left: 4px;
}

.vdb-c-line-clamp-2 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
