<template>
  <div
    class="vdb-c-fixed vdb-c-inset-0 vdb-c-flex vdb-c-items-center vdb-c-justify-center vdb-c-bg-black/50"
    v-if="showUploadDialog"
    @click="handleCancel"
  >
    <div
      class="vdb-c-shadow-xl vdb-c-w-[480px] vdb-c-rounded-lg vdb-c-bg-[#1F1F1F]"
      @click.stop
    >
      <!-- Header -->
      <div
        class="vdb-c-flex vdb-c-items-center vdb-c-justify-between vdb-c-p-24"
      >
        <h2 class="vdb-c-text-base vdb-c-font-semibold vdb-c-text-white">
          Upload Media
        </h2>
        <button
          @click="handleCancel"
          class="vdb-c-text-gray-400 hover:vdb-c-text-white"
        >
          <CrossIcon class="vdb-c-h-20 vdb-c-w-20" fill="#848484" />
        </button>
      </div>

      <!-- Body -->
      <div class="vdb-c-space-y-24 vdb-c-p-24">
        <!-- URL Input -->
        <div>
          <input
            type="text"
            placeholder="Upload a URL"
            class="vdb-c-w-full vdb-c-rounded-lg vdb-c-border vdb-c-border-[#424242] vdb-c-bg-[#0C0C0C] vdb-c-px-16 vdb-c-py-8 vdb-c-text-white placeholder:vdb-c-text-[#424242] focus:vdb-c-outline-none focus:vdb-c-ring-1 focus:vdb-c-ring-[#FF5B0A]"
            v-model="url"
            :disabled="hasUploadedFile"
            @input="handleUrlInput"
          />
          <p
            v-if="hasUploadedFile"
            class="vdb-c-mt-2 vdb-c-text-xs vdb-c-text-gray-400"
          >
            URL input disabled - file already selected
          </p>
        </div>

        <!-- Divider -->
        <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-16">
          <div class="vdb-c-h-px vdb-c-flex-1 vdb-c-bg-gray-800"></div>
          <span class="vdb-c-text-gray-500">Or</span>
          <div class="vdb-c-h-px vdb-c-flex-1 vdb-c-bg-gray-800"></div>
        </div>

        <!-- Drop Zone -->
        <div
          :class="[
            'vdb-c-rounded-lg vdb-c-border-2 vdb-c-border-dashed vdb-c-p-32 vdb-c-text-center vdb-c-transition-colors',
            isDragging
              ? 'vdb-c-border-[#FF5B0A] vdb-c-bg-black/40'
              : hasUrl || hasUploadedFile
                ? 'vdb-c-border-[#2C2C2C] vdb-c-bg-[#1A1A1A]'
                : 'vdb-c-cursor-pointer vdb-c-border-white/20 vdb-c-bg-black/20 hover:vdb-c-border-white/40 hover:vdb-c-bg-black/20',
          ]"
          @dragenter.prevent="handleDragEnter"
          @dragleave.prevent="handleDragLeave"
          @dragover.prevent="handleDragOver"
          @drop.prevent="handleDrop"
          @click="!hasUrl && !hasUploadedFile && triggerFileInput()"
        >
          <input
            type="file"
            ref="fileInputEl"
            class="vdb-c-hidden"
            accept="audio/*,video/*,image/*"
            @change="handleFileSelect"
          />
          <div
            v-if="hasUploadedFile"
            class="vdb-c-flex vdb-c-flex-col vdb-c-items-center vdb-c-gap-8"
          >
            <p class="vdb-c-text-gray-300">
              Selected file: {{ fileInput.name }}
            </p>
            <button
              @click.stop="clearSelectedFile"
              class="vdb-c-text-[#FF5B0A] hover:vdb-c-text-[#FF7B3A]"
            >
              Remove file
            </button>
          </div>
          <p v-else class="vdb-c-text-gray-300">
            {{
              hasUrl
                ? "File upload disabled - URL already entered"
                : isDragging
                  ? "Drop your files here"
                  : "Click or drop audio, video or image files here to upload"
            }}
          </p>
        </div>

        <!-- Folder Selection -->
        <div class="vdb-c-flex vdb-c-items-center vdb-c-justify-between">
          <label class="vdb-c-text-gray-300">Add files to*</label>
          <div class="vdb-c-relative vdb-c-w-[70%]">
            <button
              @click.stop="isDropdownOpen = !isDropdownOpen"
              class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-rounded-lg vdb-c-border vdb-c-border-[#424242] vdb-c-bg-[#0C0C0C] vdb-c-px-16 vdb-c-py-8 vdb-c-text-white"
              :class="{
                'vdb-c-border-[#FF5B0A]': isDropdownOpen,
              }"
            >
              {{
                selectedCollection
                  ? collections.find((c) => c.id === selectedCollection)?.name
                  : "Select Collection"
              }}
              <ChevronDown
                class="vdb-c-h-16 vdb-c-w-16"
                :class="{ 'vdb-c-rotate-180': isDropdownOpen }"
                stroke-color="#ffffff"
                :stroke-width="2"
              />
            </button>
            <div
              v-if="isDropdownOpen"
              class="vdb-c-absolute vdb-c-z-10 vdb-c-mt-4 vdb-c-max-h-[200px] vdb-c-w-full vdb-c-overflow-y-auto vdb-c-rounded-lg vdb-c-bg-[#141414]"
            >
              <div
                v-for="collection in collections"
                :key="collection.id"
                @click.stop="
                  selectedCollection = collection.id;
                  isDropdownOpen = false;
                "
                class="vdb-c-cursor-pointer vdb-c-px-16 vdb-c-py-8 vdb-c-text-white vdb-c-transition-colors hover:vdb-c-bg-[#1F1F1F] hover:vdb-c-text-gray-300"
              >
                {{ collection.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="vdb-c-flex vdb-c-justify-center vdb-c-gap-12 vdb-c-border-t vdb-c-border-gray-800 vdb-c-p-16"
      >
        <Button
          @click="handleUpload"
          variant="tertiary"
          class="!vdb-c-px-12 !vdb-c-py-8"
        >
          Upload
        </Button>
        <button
          @click="handleCancel"
          class="vdb-c-px-16 vdb-c-py-8 vdb-c-text-gray-300 vdb-c-transition-colors hover:vdb-c-text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChevronDown from "../icons/ChevronDown.vue";
import CrossIcon from "../icons/Cross.vue";
import Button from "../buttons/Button.vue";
import { ref, watch } from "vue";

const emit = defineEmits(["cancel-upload", "upload"]);

const props = defineProps({
  showUploadDialog: {
    type: Boolean,
    required: true,
  },
  defaultSelectedCollectionId: {
    type: String,
    default: null,
  },
  collections: {
    type: Array,
    default: () => [],
    required: true,
  },
});

let dragCounter = 0;
const isDragging = ref(false);

const hasUrl = ref(false);
const hasUploadedFile = ref(false);

const url = ref("");
const fileInput = ref(null);
const fileInputEl = ref(null);

const selectedCollection = ref(null);
const isDropdownOpen = ref(false);

const clearState = () => {
  dragCounter = 0;
  isDragging.value = false;
  hasUrl.value = false;
  hasUploadedFile.value = false;
  url.value = "";
  fileInput.value = null;
  selectedCollection.value = props.defaultSelectedCollectionId || null;
  isDropdownOpen.value = false;
};

const handleUrlInput = (e) => {
  if (e.target.value) {
    hasUrl.value = true;
  } else {
    hasUrl.value = false;
  }
};

const clearSelectedFile = () => {
  fileInput.value = null;
  hasUploadedFile.value = false;
};

const handleDragEnter = (e) => {
  e.preventDefault();
  dragCounter++;
  if (!hasUrl.value && !hasUploadedFile.value) {
    isDragging.value = true;
  }
};

const handleDragLeave = (e) => {
  e.preventDefault();
  dragCounter--;
  if (dragCounter === 0) {
    isDragging.value = false;
  }
};

const handleDragOver = (e) => {
  e.preventDefault();
  if (!hasUrl.value && !hasUploadedFile.value) {
    isDragging.value = true;
  }
};

const handleDrop = (e) => {
  e.preventDefault();
  isDragging.value = false;
  dragCounter = 0;

  if (!hasUrl.value && !hasUploadedFile.value) {
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("audio/") ||
        file.type.startsWith("video/") ||
        file.type.startsWith("image/"),
    );

    if (validFiles.length > 0) {
      hasUploadedFile.value = true;
      url.value = "";
      hasUrl.value = false;

      // Choose 1st file
      fileInput.value = files[0];
    }
  }
};

const handleFileSelect = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    hasUploadedFile.value = true;
    url.value = "";
    hasUrl.value = false;
    fileInput.value = files[0];
  }
};

const triggerFileInput = () => {
  fileInputEl.value?.click();
};

const handleCancel = () => {
  emit("cancel-upload");
  clearState();
};

const handleUpload = () => {
  if (hasUrl.value) {
    emit("upload", {
      source: { url: url.value },
      sourceType: "url",
      collectionId: selectedCollection.value,
    });
  } else if (hasUploadedFile.value) {
    emit("upload", {
      source: fileInput.value,
      sourceType: "file",
      collectionId: selectedCollection.value,
    });
  }
  clearState();
};

watch(
  () => props.collections,
  (newCollections) => {
    if (newCollections.length > 0 && !selectedCollection.value) {
      selectedCollection.value =
        props.defaultSelectedCollectionId || newCollections[0].id;
    }
  },
  { immediate: true },
);

watch(
  () => props.defaultSelectedCollectionId,
  (newDefaultId) => {
    if (newDefaultId) {
      selectedCollection.value = newDefaultId;
    }
  },
);
</script>
