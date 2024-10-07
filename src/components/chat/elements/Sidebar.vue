<template>
  <div
    class="vdb-c-flex vdb-c-h-full vdb-c-flex-col vdb-c-gap-16 vdb-c-border-r vdb-c-bg-white vdb-c-p-16 vdb-c-pl-12 vdb-c-pr-20 vdb-c-text-black"
  >
    <div class="vdb-c-p-12 vdb-c-text-2xl vdb-c-font-bold">
      <VideoDBIcon />
    </div>
    <Button
      variant="primary"
      @click="$emit('create-new-session')"
      class="vdb-c-px-10 vdb-c-py-12"
    >
      <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-6">
        <ComposeIcon />
        <span
          class="vdb-c-hidden vdb-c-text-sm vdb-c-font-normal md:vdb-c-block"
          >New Session</span
        >
      </div>
    </Button>
    <div
      class="vdb-c-flex vdb-c-flex-grow vdb-c-flex-col vdb-c-gap-16 vdb-c-overflow-hidden"
    >
      <!-- Explore Agents -->
      <div class="vdb-c-flex vdb-c-flex-col">
        <button
          @click="toggleExploreAgents"
          :class="[
            'vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-rounded-lg vdb-c-px-12 vdb-c-py-10 vdb-c-text-sm vdb-c-font-normal vdb-c-text-[#1E1E1E]',
            { 'vdb-c-bg-blue-100': showExploreAgents },
          ]"
        >
          <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-8">
            <MenuIcon class="vdb-c-mr-8" />
            <span>Explore Agents</span>
          </div>
          <DownArrowIcon
            :class="[
              'vdb-c-h-16 vdb-c-w-16 vdb-c-transition-transform',
              { 'vdb-c-rotate-180': showExploreAgents },
            ]"
            :stroke-width="1.2"
          />
        </button>
        <div
          v-if="showExploreAgents"
          class="vdb-c-mt-8 vdb-c-max-h-48 vdb-c-overflow-y-auto"
        ></div>
      </div>

      <!-- Sessions -->
      <div
        class="vdb-c-flex vdb-c-max-h-[34%] vdb-c-flex-col vdb-c-overflow-hidden"
      >
        <button
          @click="toggleSessions"
          class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-rounded vdb-c-px-8 vdb-c-py-4 vdb-c-text-[#464646]"
        >
          <span
            class="vdb-c-text-xs vdb-c-font-bold vdb-c-uppercase vdb-c-leading-5"
            >Sessions</span
          >
          <div class="vdb-c-p-4">
            <DownArrowIcon
              :class="[
                'vdb-c-h-16 vdb-c-w-16 vdb-c-transition-transform',
                { 'vdb-c-rotate-180': showSessions },
              ]"
              :stroke-width="1.5"
            />
          </div>
        </button>
        <div v-if="showSessions" class="vdb-c-mt-4 vdb-c-overflow-y-auto">
          <template v-for="session in allSessions" :key="session.session_id">
            <div
              @click="$emit('session-click', session.session_id)"
              :class="[
                'vdb-c-cursor-pointer vdb-c-truncate vdb-c-rounded-lg vdb-c-p-8 vdb-c-text-sm vdb-c-text-[#1E1E1E]',
                {
                  'vdb-c-bg-blue-100': session.session_id === selectedSession,
                  'hover:vdb-c-bg-gray-100': session.session_id !== selectedSession
                }
              ]"
            >
              {{ session.session_id }}
            </div>
          </template>
        </div>
      </div>

      <!-- Collections -->
      <div
        class="vdb-c-flex vdb-c-max-h-[34%] vdb-c-flex-col vdb-c-overflow-hidden"
      >
        <button
          @click="toggleCollections"
          class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-rounded vdb-c-px-8 vdb-c-py-4 vdb-c-text-[#464646]"
        >
          <span
            class="vdb-c-text-xs vdb-c-font-bold vdb-c-uppercase vdb-c-leading-5"
            >Collections</span
          >
          <div class="vdb-c-p-4">
            <DownArrowIcon
              :class="[
                'vdb-c-h-16 vdb-c-w-16 vdb-c-transition-transform',
                { 'vdb-c-rotate-180': showCollections },
              ]"
              :stroke-width="1.5"
            />
          </div>
        </button>
        <div v-if="showCollections" class="vdb-c-mt-4 vdb-c-overflow-y-auto">
          <template v-for="collection in allCollections" :key="collection.id">
            <div
              @click="$emit('collection-click', collection.id)"
              :class="[
                'vdb-c-cursor-pointer vdb-c-truncate vdb-c-rounded-lg vdb-c-p-8 vdb-c-text-sm vdb-c-text-[#1E1E1E]',
                {
                  'vdb-c-bg-blue-100': collection.id === selectedCollection,
                  'hover:vdb-c-bg-gray-100': collection.id !== selectedCollection
                }
              ]"
            >
              {{ collection.name }}
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="vdb-c-mt-auto">
      <a
        v-for="(link, index) in links"
        :key="index"
        class="vdb-c-mx-8 vdb-c-my-12 vdb-c-text-sm vdb-c-font-normal vdb-c-text-[#1E1E1E] hover:vdb-c-text-[#1E1E1E] hover:vdb-c-no-underline"
        :href="link.href"
        :target="link.target || '_blank'"
        rel="noopener noreferrer"
      >
        {{ link.text }}
      </a>
      <button
        class="vdb-c-mt-16 vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-center vdb-c-rounded vdb-c-bg-orange-500 vdb-c-px-16 vdb-c-py-8 vdb-c-text-white"
      >
        <a
          :href="primaryLink.href"
          :target="primaryLink.target || '_blank'"
          rel="noopener noreferrer"
          class="vdb-c-text-white hover:vdb-c-text-white hover:vdb-c-no-underline"
        >
          {{ primaryLink.text }}
        </a>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "../../buttons/Button.vue";
import VideoDBIcon from "../../icons/VideoDBIcon.vue";
import ComposeIcon from "../../icons/Compose.vue";
import DownArrowIcon from "../../icons/DownArrow.vue";
import MenuIcon from "../../icons/MenuIcon.vue";

const showExploreAgents = ref(false);
const showSessions = ref(true);
const showCollections = ref(false);

const toggleExploreAgents = () => {
  showExploreAgents.value = !showExploreAgents.value;
};

const toggleSessions = () => {
  showSessions.value = !showSessions.value;
};

const toggleCollections = () => {
  showCollections.value = !showCollections.value;
};

defineProps({
  allSessions: {
    type: Array,
    required: true,
  },
  allCollections: {
    type: Array,
    required: true,
  },
  links: {
    type: Array,
    required: true,
    default: () => [],
  },
  primaryLink: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  selectedCollection: {
    type: String,
    default: '',
  },
  selectedSession: {
    type: String,
    default: '',
  },
});

defineEmits(["create-new-session", "session-click", "collection-click"]);
</script>
