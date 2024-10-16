<template>
  <div
    class="vdb-c-flex vdb-c-h-full vdb-c-flex-col vdb-c-gap-16 vdb-c-border-r vdb-c-bg-white vdb-c-p-16 vdb-c-pl-12 vdb-c-pr-20 vdb-c-text-black"
  >
    <div class="vdb-c-p-12 vdb-c-text-2xl vdb-c-font-bold">
      <SpielbergIcon />
    </div>
    <Button
      variant="primary"
      @click="$emit('create-new-session')"
      class="vdb-c-px-10 vdb-c-py-12"
    >
      <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-6">
        <ComposeIcon />
        <span
          class="vdb-c-hidden vdb-c-text-sm vdb-c-font-medium md:vdb-c-block"
          >New Session</span
        >
      </div>
    </Button>
    <div
      class="vdb-c-flex vdb-c-flex-grow vdb-c-flex-col vdb-c-gap-16 vdb-c-overflow-hidden"
    >
      <!-- Explore Agents -->
      <div
        class="vdb-c-flex vdb-c-max-h-[34%] vdb-c-flex-col vdb-c-gap-4 vdb-c-rounded-lg vdb-c-border vdb-c-border-transparent"
        :class="{ 'vdb-c-explore-agents-animation': isExploreAgentsFocused }"
      >
        <button
          @click="toggleExploreAgents()"
          :class="[
            'vdb-c-text-vdb-darkishgrey hover:vdb-c-bg-roy vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-rounded-lg vdb-c-px-12 vdb-c-py-10 vdb-c-text-sm vdb-c-font-medium vdb-c-transition-all vdb-c-duration-300',
          ]"
        >
          <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-8">
            <MenuIcon class="vdb-c-mr-8" />
            <span>Explore Agents</span>
          </div>
          <DownArrowIcon
            :class="[
              'vdb-c-h-16 vdb-c-w-16 vdb-c-transition-transform vdb-c-duration-300',
              { 'vdb-c-rotate-180': showExploreAgents },
            ]"
            :stroke-width="1.2"
          />
        </button>
        <div
          v-if="showExploreAgents"
          class="vdb-c-overflow-y-auto vdb-c-rounded-lg vdb-c-px-8 vdb-c-py-4"
        >
          <template v-for="(agent, index) in allAgents" :key="index">
            <div
              @click="$emit('agent-click', agent)"
              :class="[
                'vdb-c-cursor-pointer vdb-c-truncate vdb-c-rounded-lg vdb-c-border vdb-c-border-transparent vdb-c-bg-white vdb-c-p-8 vdb-c-text-sm vdb-c-font-medium vdb-c-text-black vdb-c-transition-all vdb-c-duration-75 hover:vdb-c-bg-[#FFF5EC]',
              ]"
            >
              <span class="vdb-c-text-vdb-orange"> @ </span>
              <span> {{ agent.name }} </span>
            </div>
          </template>
        </div>
      </div>

      <!-- Sessions -->
      <div
        class="vdb-c-flex vdb-c-max-h-[34%] vdb-c-flex-col vdb-c-overflow-hidden"
      >
        <button
          @click="toggleSessions()"
          class="vdb-c-text-pam vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-rounded vdb-c-px-8 vdb-c-py-4"
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
          <div v-if="addDummySession">
            <div
              class="vdb-c-bg-roy vdb-c-text-vdb-darkishgrey vdb-c-cursor-pointer vdb-c-truncate vdb-c-rounded-lg vdb-c-p-8 vdb-c-text-sm vdb-c-font-medium"
            >
              (new session)
            </div>
          </div>
          <template v-for="session in allSessions" :key="session.session_id">
            <div
              @click="$emit('session-click', session.session_id)"
              :class="[
                'vdb-c-text-vdb-darkishgrey vdb-c-cursor-pointer vdb-c-truncate vdb-c-rounded-lg vdb-c-p-8 vdb-c-text-sm vdb-c-font-medium',
                {
                  'vdb-c-bg-roy': session.session_id === selectedSession,
                  'hover:vdb-c-bg-gray-100':
                    session.session_id !== selectedSession,
                },
              ]"
            >
              {{
                new Date(session.created_at * 1000)
                  .toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })
                  .replace(/\//g, ".")
                  .replace(",", " -")
              }}
            </div>
          </template>
        </div>
      </div>

      <!-- Collections -->
      <div
        class="vdb-c-flex vdb-c-max-h-[34%] vdb-c-flex-col vdb-c-overflow-hidden"
      >
        <button
          @click="toggleCollections()"
          class="vdb-c-text-pam vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-rounded vdb-c-px-8 vdb-c-py-4"
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
                'vdb-c-text-vdb-darkishgrey vdb-c-cursor-pointer vdb-c-truncate vdb-c-rounded-lg vdb-c-p-8 vdb-c-text-sm vdb-c-font-medium',
                {
                  'vdb-c-bg-roy':
                    showSelectedCollection &&
                    collection.id === computedSelectedCollection,
                  'hover:vdb-c-bg-gray-100':
                    collection.id !== computedSelectedCollection,
                },
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
        class="vdb-c-text-vdb-darkishgrey hover:vdb-c-text-vdb-darkishgrey vdb-c-mx-8 vdb-c-my-12 vdb-c-text-sm vdb-c-font-medium hover:vdb-c-no-underline"
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
          class="vdb-c-flex vdb-c-items-center vdb-c-text-white hover:vdb-c-text-white hover:vdb-c-no-underline"
        >
          <template v-if="primaryLink.icon">
            <img
              v-if="typeof primaryLink.icon === 'string'"
              :src="primaryLink.icon"
              alt="Primary Link Icon"
              class="vdb-c-mr-8 vdb-c-h-16 vdb-c-w-16"
            />
            <component
              v-else-if="typeof primaryLink.icon === 'object'"
              :is="primaryLink.icon"
              class="vdb-c-mr-8 vdb-c-h-16 vdb-c-w-16"
            />
          </template>
          {{ primaryLink.text }}
        </a>
      </button>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch, computed } from "vue";

import Button from "../../buttons/Button.vue";

import SpielbergIcon from "../../icons/Spielberg2.vue";
import ComposeIcon from "../../icons/Compose.vue";
import DownArrowIcon from "../../icons/DownArrow.vue";
import MenuIcon from "../../icons/Menu.vue";

const showExploreAgents = ref(false);
const showSessions = ref(true);
const showCollections = ref(false);
const isExploreAgentsFocused = ref(false);
const exploreAgentsTimeout = ref(null);

const toggleExploreAgents = (value) => {
  showExploreAgents.value =
    value !== undefined ? value : !showExploreAgents.value;
};

const toggleSessions = (value) => {
  showSessions.value = value !== undefined ? value : !showSessions.value;
};

const toggleCollections = (value) => {
  showCollections.value = value !== undefined ? value : !showCollections.value;
};

const triggerExploreAgentsFocusAnimation = () => {
  if (exploreAgentsTimeout.value) {
    clearTimeout(exploreAgentsTimeout.value);
  }
  isExploreAgentsFocused.value = false;
  nextTick(() => {
    isExploreAgentsFocused.value = true;
    exploreAgentsTimeout.value = setTimeout(() => {
      isExploreAgentsFocused.value = false;
    }, 1000);
  });
};

const props = defineProps({
  allSessions: {
    type: Array,
    required: true,
  },
  allCollections: {
    type: Array,
    required: true,
  },
  allAgents: {
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
    default: "default",
  },
  selectedSession: {
    type: String,
    default: "",
  },
  addDummySession: {
    type: Boolean,
    default: false,
  },
  showSelectedCollection: {
    type: Boolean,
    default: false,
  },
});

const computedSelectedCollection = computed(() => {
  if (props.selectedCollection !== "default") {
    return props.selectedCollection;
  }
  return props.allCollections.length > 0 ? props.allCollections[0].id : null;
});

watch(showExploreAgents, (newValue) => {
  if (newValue) {
    triggerExploreAgentsFocusAnimation();
  }
});

defineEmits([
  "create-new-session",
  "session-click",
  "collection-click",
  "agent-click",
]);

defineExpose({
  toggleExploreAgents,
  toggleSessions,
  toggleCollections,
  triggerExploreAgentsFocusAnimation,
});
</script>

<style>
.vdb-c-explore-agents-animation {
  animation: exploreAgentsFade 1s ease-out;
}

.vdb-c-explore-agents-animation button {
  animation: exploreAgentButtonFade 1s ease-out;
}

@keyframes exploreAgentsFade {
  0% {
    border-color: #ff7e32;
    background-color: #fff5ec;
  }
  100% {
    border-color: transparent;
    background-color: transparent;
  }
}

@keyframes exploreAgentButtonFade {
  0% {
    background-color: #ffe9d3;
  }
  100% {
    background-color: transparent;
  }
}
</style>
