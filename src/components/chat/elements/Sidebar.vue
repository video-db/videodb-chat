<template>
  <div
    class="vdb-c-flex vdb-c-h-full vdb-c-flex-col vdb-c-gap-16 vdb-c-border-r vdb-c-bg-white vdb-c-p-16 vdb-c-pl-12 vdb-c-pr-20 vdb-c-text-black"
  >
    <div class="vdb-c-p-12 vdb-c-text-2xl vdb-c-font-bold">
      <VideoDBIcon />
    </div>
    <Button variant="primary" @click="$emit('create-new-session')">
      <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-4">
        <ComposeIcon />
        <span>New Session</span>
      </div>
    </Button>
    <button
      class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-rounded vdb-c-px-16 vdb-c-py-8 vdb-c-text-gray-700"
    >
      Explore Agents
      <svg
        class="vdb-c-h-16 vdb-c-w-16"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>
    <div
      class="vdb-c-mb-4 vdb-c-p-8 vdb-c-text-sm vdb-c-font-bold vdb-c-text-[#464646]"
    >
      SESSIONS
    </div>
    <div class="vdb-c-max-h-[50%] vdb-c-overflow-y-auto">
      <template v-for="session in allSessions" :key="session.id">
        <div
          class="vdb-c-cursor-pointer vdb-c-truncate vdb-c-rounded-lg vdb-c-p-8 vdb-c-text-sm vdb-c-text-[#1E1E1E] hover:vdb-c-bg-[#EFEFEF]"
        >
          {{ session.session_id }}
        </div>
      </template>
    </div>
    <div class="vdb-c-mt-auto">
      <div class="vdb-c-mb-8 vdb-c-text-sm">About Spielberg</div>
      <div class="vdb-c-mb-8 vdb-c-text-sm">Documentation</div>
      <button
        class="vdb-c-mt-16 vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-center vdb-c-rounded vdb-c-bg-orange-500 vdb-c-px-16 vdb-c-py-8 vdb-c-text-white"
      >
        VideoDB Console
        <svg
          class="vdb-c-ml-8 vdb-c-h-16 vdb-c-w-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import Button from "../../buttons/Button.vue";
import VideoDBIcon from "../../icons/VideoDBIcon.vue";
import ComposeIcon from "../../icons/Compose.vue";

defineProps({
  allSessions: {
    type: Array,
    required: true,
  },
});

defineEmits(["toggle", "create-new-session"]);
</script>
