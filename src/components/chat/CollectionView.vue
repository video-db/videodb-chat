<template>
  <div class="vdb-c-flex vdb-c-items-center vdb-c-justify-between">
    <div
      class="vdb-c-relative vdb-c-flex vdb-c-w-[60%] vdb-c-justify-between vdb-c-text-sm"
    >
      <div
        class="gap-8 vdb-c-flex vdb-c-w-[100%] vdb-c-items-center vdb-c-rounded-8 vdb-c-border vdb-c-border-gray-300 vdb-c-bg-gray-50 vdb-c-px-10 vdb-c-py-8 vdb-c-text-sm vdb-c-text-black vdb-c-outline-none"
      >
        <SearchIcon class="vdb-c-text-gray-700" />
        <input
          v-model="searchQuery"
          @input="handleInput"
          class="p-4 h-full vdb-c-block vdb-c-w-[100%] vdb-c-bg-gray-50 vdb-c-px-8 vdb-c-text-sm vdb-c-text-black vdb-c-placeholder-gray-700 vdb-c-outline-none"
          type="text"
          placeholder="Search"
        />
      </div>
      <ul
        v-if="showAutocomplete"
        class="vdb-c-absolute vdb-c-top-[100%] vdb-c-z-10 vdb-c-w-[100%] vdb-c-cursor-pointer vdb-c-rounded-8 vdb-c-bg-white vdb-c-shadow-lg"
      >
        <li
          class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-gap-12 vdb-c-rounded-8 vdb-c-bg-white vdb-c-px-10 vdb-c-py-8 vdb-c-text-sm vdb-c-text-black hover:vdb-c-bg-[#EFEFEF]"
          v-for="item in filteredAssets.slice(0, 5)"
          :key="item.id"
          @click="selectItem(item)"
        >
          <SearchIcon class="vdb-c-text-black" />
          <div>
            <span
              v-for="(part, idx) in getHighlightedParts(item.name)"
              :key="idx"
            >
              <b v-if="part.bold">{{ part.text }}</b>
              <span v-else>{{ part.text }}</span>
            </span>
          </div>
        </li>
      </ul>
    </div>
    <div class="vdb-c-relative">
      <button
        @click="toggleMediaDropdown"
        class="border border-gray-700 vdb-c-flex vdb-c-items-center vdb-c-gap-8 vdb-c-rounded-8 vdb-c-bg-white vdb-c-px-12 vdb-c-py-6 vdb-c-text-black"
      >
        Type
        <ChevronDown />
      </button>
      <ul
        v-if="showMediaDropdown"
        class="vdb-c-absolute vdb-c-right-0 vdb-c-top-[calc(100%+8px)] vdb-c-z-10 vdb-c-w-[180%] vdb-c-cursor-pointer vdb-c-rounded-8 vdb-c-bg-white vdb-c-p-4 vdb-c-text-sm vdb-c-shadow-lg"
      >
        <li
          class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-gap-12 vdb-c-rounded-8 vdb-c-bg-white vdb-c-px-10 vdb-c-py-8 vdb-c-text-sm vdb-c-text-black hover:vdb-c-bg-[#EFEFEF]"
          v-for="item in mediaTypes"
          :key="item.id"
          @click="selectMedia(item)"
        >
          <div>
            {{ item.name }}
          </div>
          <RedCheck v-if="item.id === currentMediaType.id" />
        </li>
      </ul>
    </div>
  </div>
  <div class="vdb-c-mx-auto vdb-c-w-11/12 vdb-c-py-28">
    <div v-if="collectionVideos !== null">
      <VideoList
        v-if="videos.length > 0"
        :asset-results="filteredAssets"
        @video-click="handleVideoClick"
        @delete-video="emit('delete-video', $event)"
        @delete-image="emit('delete-image', $event)"
        @delete-audio="emit('delete-audio', $event)"
      />
      <div
        v-else
        class="vdb-c-flex vdb-c-flex-col vdb-c-items-center vdb-c-justify-center vdb-c-gap-32 vdb-c-py-32 vdb-c-text-center vdb-c-text-black"
      >
        <div class="vdb-c-text-2xl vdb-c-font-bold">
          Your Collection is empty
        </div>
        <Button
          @click="
            loadSession();
            addMessage({
              content: [
                { type: 'text', text: 'Upload a video to this collection' },
              ],
            });
            chatInput = '';
          "
          variant="tertiary"
          class="vdb-c-mt-12"
        >
          <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-6">
            <UploadIcon />
            <span>Upload a video</span>
          </div>
        </Button>
      </div>
    </div>

    <VideoListLoader v-else />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import Button from "../buttons/Button.vue";
import VideoList from "../collection/VideoList.vue";
import VideoListLoader from "../collection/VideoListLoader.vue";
import UploadIcon from "../icons/FileUpload.vue";

import { useVideoDBChat } from "../../context";
import ChevronDown from "../icons/ChevronDown.vue";
import RedCheck from "../icons/RedCheck.vue";
import SearchIcon from "../icons/SearchIcon.vue";

const { chatInput, loadSession, addMessage } = useVideoDBChat();

const props = defineProps({
  collectionId: {
    type: String,
    required: true,
  },
  collectionData: {
    type: Object,
    default: null,
  },
  collectionVideos: {
    type: Array,
    default: null,
  },
  collectionAudios: {
    type: Array,
    default: null,
  },
  collectionImages: {
    type: Array,
    default: null,
  },
});

const mediaTypes = [
  {
    id: "all_files",
    name: "All Files",
  },
  {
    id: "videos",
    name: "Video",
  },
  {
    id: "audios",
    name: "Audio",
  },
  {
    id: "images",
    name: "Image",
  },
];

const searchQuery = ref("");
const showAutocomplete = ref(false);
const showMediaDropdown = ref(false);
const currentMediaType = ref(mediaTypes[0]);

function toggleMediaDropdown() {
  showMediaDropdown.value = !showMediaDropdown.value;
}

function selectMedia(item) {
  currentMediaType.value = item;
  showMediaDropdown.value = false;
}

const handleInput = () => {
  showAutocomplete.value = searchQuery.value.trim() !== "";
};

const selectItem = (item) => {
  searchQuery.value = item.name;
  showAutocomplete.value = false;
};

const emit = defineEmits([
  "video-click",
  "delete-video",
  "delete-audio",
  "delete-image",
]);

const videos = computed(() => {
  if (props.collectionVideos === null) {
    return [];
  }
  return props.collectionVideos;
});

const audios = computed(() => {
  if (props.collectionAudios === null) {
    return [];
  }
  return props.collectionAudios;
});

const images = computed(() => {
  if (props.collectionImages === null) {
    return [];
  }
  return props.collectionImages;
});

const filteredAssets = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  let assets = [];
  if (currentMediaType.value.id === "all_files") {
    assets = [...videos.value, ...audios.value, ...images.value];
  } else if (currentMediaType.value.id === "videos") {
    assets = [...videos.value];
  } else if (currentMediaType.value.id === "audios") {
    assets = [...audios.value];
  } else if (currentMediaType.value.id === "images") {
    assets = [...images.value];
  }
  if (!query) return assets;
  return assets.filter((asset) => asset.name?.toLowerCase().includes(query));
});
const getHighlightedParts = (text) => {
  const query = searchQuery.value.trim();
  if (!query) return [{ text, bold: false }];

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  let parts = [];

  let matchIndex = lowerText.indexOf(lowerQuery);
  if (matchIndex === -1) {
    return [{ text, bold: false }];
  }

  if (matchIndex > 0) {
    parts.push({ text: text.slice(0, matchIndex), bold: true });
  }

  parts.push({
    text: text.slice(matchIndex, matchIndex + query.length),
    bold: false,
  });

  if (matchIndex + query.length < text.length) {
    parts.push({ text: text.slice(matchIndex + query.length), bold: true });
  }

  return parts;
};

const handleVideoClick = (video) => {
  emit("video-click", video);
};
</script>
