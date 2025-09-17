<template>
  <div
    :class="[
      'vdb-c-flex vdb-c-h-full vdb-c-flex-col vdb-c-gap-16 vdb-c-border-l vdb-c-bg-white vdb-c-p-16 vdb-c-pl-12 vdb-c-pr-20 vdb-c-text-black',
      {
        'vdb-c-w-1/5': !isMobile,
        'vdb-c-fixed vdb-c-left-0 vdb-c-top-0 vdb-c-z-50 vdb-c-h-full vdb-c-w-4/5 vdb-c-transform vdb-c-transition-transform vdb-c-duration-300 vdb-c-ease-in-out md:vdb-c-w-2/5':
          isMobile,
        'vdb-c--translate-x-full': isMobile && !isOpen,
      },
    ]"
  >
    <div class="vdb-c-flex vdb-c-items-center vdb-c-justify-between">
      <div class="vdb-c-cursor-pointer vdb-c-text-2xl vdb-c-font-bold">
        <component
          v-if="config.icon"
          :is="config.icon"
          @click="$emit('create-new-session')"
        />
      </div>
      <button
        v-if="isMobile"
        @click="closeSidebar"
        class="vdb-c-text-2xl vdb-c-font-bold"
      >
        &times;
      </button>
    </div>
    <Button
      variant="primary"
      class="vdb-c-px-10 vdb-c-py-12"
      :class="{
        'vdb-c-pointer-events-none vdb-c-opacity-20':
          newSessionButtonStatus !== 'active',
      }"
      @click="
        $emit('create-new-session');
        closeSidebar();
      "
    >
      <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-6">
        <ComposeIcon />
        <span class="vdb-c-block vdb-c-text-sm vdb-c-font-medium"
          >New Chat</span
        >
      </div>
    </Button>
    <div
      class="vdb-c-flex vdb-c-flex-grow vdb-c-flex-col vdb-c-gap-16 vdb-c-overflow-hidden"
      :class="{
        'vdb-c-pointer-events-none vdb-c-opacity-20': status === 'inactive',
      }"
    >
      <template v-for="section in visibleSections" :key="section">
        <!-- Collections -->
        <div
          v-if="section === 'collections'"
          class="sidebar-section vdb-c-flex vdb-c-flex-col vdb-c-overflow-hidden"
          :style="{
            'max-height': `calc(100% / ${visibleSections.length})`,
          }"
        >
          <div
            class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-rounded-lg vdb-c-px-12 vdb-c-py-6 vdb-c-text-pam hover:vdb-c-bg-roy"
          >
            <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-8">
              <CollectionIcon class="vdb-c-mr-8" fill="#464646" />
              <span class="vdb-c-font-semibold vdb-c-leading-5"
                >Collections</span
              >
            </div>
            <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-4">
              <button
                class="vdb-c-flex vdb-c-items-center vdb-c-gap-4"
                aria-label="Create Collection"
                @click="$emit('create-collection')"
              >
                <PlusIcon stroke-color="#464646" />
              </button>
            </div>
          </div>
          <div
            v-if="status !== 'inactive' && showCollections"
            class="vdb-c-mt-4 vdb-c-overflow-y-auto"
          >
            <template v-for="collection in collections" :key="collection.id">
              <div
                @mouseenter="hoveredCollection = collection.id"
                @mouseleave="hoveredCollection = null"
              >
                <!-- Collection Item -->
                <div
                  @click="
                    $emit('collection-click', collection.id);
                    closeSidebar();
                  "
                  :class="[
                    'vdb-c-ml-24 vdb-c-flex vdb-c-cursor-pointer vdb-c-items-center vdb-c-justify-between vdb-c-truncate vdb-c-rounded-lg vdb-c-p-8 vdb-c-px-16 vdb-c-text-sm vdb-c-font-medium vdb-c-text-vdb-darkishgrey',
                    {
                      'vdb-c-bg-[#FFF5EC]':
                        showSelectedCollection &&
                        collection.id === computedSelectedCollection,
                      'hover:vdb-c-bg-[#FFF5EC]':
                        collection.id !== computedSelectedCollection,
                    },
                  ]"
                >
                  <span class="vdb-c-w-[90%] vdb-c-truncate">
                    {{ collection.name }}
                  </span>
                  <!-- Delete Button -->
                  <span
                    @click.stop="$emit('delete-collection', collection)"
                    class="vdb-c-transition-all vdb-c-duration-300 hover:vdb-c-scale-110"
                  >
                    <DeleteIcon
                      :fill="
                        hoveredCollection === collection.id
                          ? 'black'
                          : '#CCCCCC'
                      "
                    />
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Explore Agents -->
        <div
          v-if="section === 'agents'"
          class="sidebar-section vdb-c-flex vdb-c-flex-col vdb-c-gap-4 vdb-c-rounded-lg vdb-c-border vdb-c-border-transparent"
          :style="{
            'max-height': `calc(100% / ${visibleSections.length})`,
          }"
        >
          <button
            @click="toggleExploreAgents()"
            :class="[
              'vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-rounded-lg vdb-c-px-12 vdb-c-py-6 vdb-c-font-medium vdb-c-text-pam vdb-c-transition-all vdb-c-duration-300 hover:vdb-c-bg-roy',
            ]"
          >
            <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-8">
              <AgentIcon class="vdb-c-mr-8" />
              <span class="vdb-c-font-semibold vdb-c-leading-5"
                >Explore Agents</span
              >
            </div>
            <div class="vdb-c-p-4">
              <ChevronDown
                :class="[
                  'vdb-c-h-16 vdb-c-w-16 vdb-c-transition-transform vdb-c-duration-300',
                  { 'vdb-c-rotate-180': showExploreAgents },
                ]"
                stroke-color="#464646"
                :stroke-width="2"
              />
            </div>
          </button>
          <div
            v-if="status !== 'inactive' && showExploreAgents"
            class="vdb-c-overflow-y-scroll vdb-c-rounded-lg vdb-c-px-8 vdb-c-py-4"
            style="scrollbar-gutter: stable"
          >
            <template v-for="(agent, index) in agents" :key="index">
              <div
                @click="
                  $emit('agent-click', agent);
                  closeSidebar();
                "
                :class="[
                  'vdb-c-ml-18 vdb-c-cursor-pointer vdb-c-truncate vdb-c-rounded-lg vdb-c-border vdb-c-border-transparent vdb-c-bg-white vdb-c-p-8 vdb-c-text-sm vdb-c-font-medium vdb-c-text-black vdb-c-transition-all vdb-c-duration-75 hover:vdb-c-bg-[#FFF5EC]',
                ]"
              >
                <span class="vdb-c-text-orange"> @ </span>
                <span> {{ agent.name }} </span>
              </div>
            </template>
          </div>
        </div>

        <!-- Sessions -->
        <div
          v-if="section === 'sessions'"
          class="sidebar-section vdb-c-flex vdb-c-flex-col vdb-c-overflow-hidden"
          :style="{
            'max-height': `calc(100% / ${visibleSections.length})`,
          }"
        >
          <button
            @click="toggleSessions()"
            class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-rounded vdb-c-px-12 vdb-c-py-6 vdb-c-text-pam hover:vdb-c-bg-roy"
          >
            <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-8">
              <ChatIcon class="vdb-c-mr-8" fill="#464646" />
              <span class="vdb-c-font-semibold vdb-c-leading-5">Chats</span>
            </div>
            <div class="vdb-c-p-4">
              <ChevronDown
                :class="[
                  'vdb-c-h-16 vdb-c-w-16 vdb-c-transition-transform',
                  { 'vdb-c-rotate-180': showSessions },
                ]"
                stroke-color="#464646"
                :stroke-width="2"
              />
            </div>
          </button>
          <div
            v-if="status !== 'inactive' && showSessions"
            class="vdb-c-mt-4 vdb-c-overflow-y-auto"
          >
            <transition name="fade" mode="out-in">
              <div v-if="addDummySession">
                <div
                  class="vdb-c-ml-24 vdb-c-cursor-pointer vdb-c-truncate vdb-c-rounded-lg vdb-c-bg-[#FFF5EC] vdb-c-p-8 vdb-c-text-sm vdb-c-font-medium vdb-c-text-vdb-darkishgrey"
                >
                  (new chat)
                </div>
              </div>
            </transition>
            <transition-group name="fade" tag="div">
              <div
                v-for="session in sessions"
                :key="session.session_id"
                @click="
                  $emit('session-click', session.session_id);
                  closeSidebar();
                "
                @mouseenter="hoveredSession = session.session_id"
                @mouseleave="hoveredSession = null"
                :class="[
                  'vdb-c-ml-24 vdb-c-flex vdb-c-cursor-pointer vdb-c-items-center vdb-c-justify-between vdb-c-truncate vdb-c-rounded-lg vdb-c-p-8 vdb-c-px-12 vdb-c-text-sm vdb-c-font-medium vdb-c-text-vdb-darkishgrey',
                  {
                    'vdb-c-bg-[#FFF5EC]':
                      session.session_id === selectedSession,
                    'hover:vdb-c-bg-[#FFF5EC]':
                      session.session_id !== selectedSession,
                  },
                ]"
              >
                <span class="vdb-c-w-[90%] vdb-c-truncate">
                  <template v-if="editingSessionId === session.session_id">
                    <input
                      :id="`edit-input-${session.session_id}`"
                      v-model="editingName"
                      type="text"
                      class="vdb-c-w-full vdb-c-truncate vdb-c-rounded vdb-c-border vdb-c-border-[#E5E5E5] vdb-c-bg-white vdb-c-px-6 vdb-c-py-2 vdb-c-text-sm vdb-c-text-black vdb-c-outline-none"
                      @click.stop
                      @keydown.enter.prevent="saveSessionName(session)"
                      @keydown.esc.stop="cancelEditing()"
                      @blur="saveSessionName(session)"
                    />
                  </template>
                  <template v-else>
                    <span
                      class="vdb-c-inline-block vdb-c-w-full vdb-c-truncate"
                      @dblclick.stop="startEditing(session)"
                      title="Double-click to rename"
                    >
                      {{
                        session.name ||
                        session?.metadata?.name ||
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
                    </span>
                  </template>
                </span>
                <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-6">
                  <Popper
                    class="vdb-session-menu"
                    hover
                    arrow
                    :placement="'right'"
                    offset-distance="8"
                    :style="{
                      '--popper-theme-background-color': '#ffffff',
                      '--popper-theme-text-color': '#000000',
                      '--popper-theme-border-color': '#e5e5e5',
                      '--popper-theme-border-width': '1px',
                      '--popper-theme-border-radius': '12px',
                      '--popper-theme-padding': '6px 0px',
                      '--popper-theme-box-shadow':
                        '0 6px 18px rgba(0, 0, 0, 0.08)',
                    }"
                  >
                    <template #content>
                      <button
                        @click.stop="copySessionId(session.session_id)"
                        :class="[
                          'vdb-c-mb-6 vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-gap-8 vdb-c-rounded-lg vdb-c-px-12 vdb-c-py-8 hover:vdb-c-bg-roy',
                          {
                            'vdb-c-text-[#53B745]':
                              copiedSessionId === session.session_id,
                          },
                        ]"
                      >
                        <template v-if="copiedSessionId === session.session_id">
                          <CheckIcon />
                          <span class="vdb-c-text-sm">Copied</span>
                        </template>
                        <template v-else>
                          <CopyIcon />
                          <span class="vdb-c-text-sm vdb-c-text-black">
                            Copy ID
                          </span>
                        </template>
                      </button>
                      <button
                        @click.stop="startEditing(session)"
                        class="vdb-c-mb-[2.5px] vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-gap-8 vdb-c-rounded-lg vdb-c-px-12 vdb-c-py-8 hover:vdb-c-bg-roy"
                      >
                        <EditIcon />
                        <span class="vdb-c-text-sm vdb-c-text-black"
                          >Rename</span
                        >
                      </button>
                      <div
                        class="vdb-c-my-2 vdb-c-mb-[2.5px] vdb-c-h-px vdb-c-bg-[#EDEDED]"
                      ></div>
                      <button
                        @click.stop="
                          $emit('delete-session', session.session_id);
                          closeSidebar();
                        "
                        class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-gap-8 vdb-c-rounded-lg vdb-c-px-12 vdb-c-py-8 vdb-c-text-[#d33] hover:vdb-c-bg-roy"
                      >
                        <DeleteIcon :fill="'#d33'" />
                        <span class="vdb-c-text-sm">Delete</span>
                      </button>
                    </template>
                    <button
                      @click.stop
                      class="vdb-c-text-[#CCCCCC] hover:vdb-c-text-black"
                      aria-label="Session actions"
                      title="Actions"
                    >
                      <DotVertical />
                    </button>
                  </Popper>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </template>
    </div>
    <div class="vdb-c-mt-auto vdb-c-flex vdb-c-flex-col">
      <a
        v-for="(link, index) in config.links"
        :key="index"
        class="vdb-c-mx-8 vdb-c-my-10 vdb-c-flex vdb-c-items-center vdb-c-gap-12 vdb-c-pl-8 vdb-c-text-sm vdb-c-font-medium vdb-c-text-vdb-darkishgrey hover:vdb-c-text-black hover:vdb-c-no-underline"
        :href="link.href"
        :target="link.target || '_blank'"
        rel="noopener noreferrer"
      >
        <span> {{ link.text }} </span>
        <component v-if="link.icon" :is="link.icon" />
      </a>
      <Button
        v-if="config.primaryLink"
        class="vdb-c-mt-16 vdb-c-w-full"
        variant="tertiary"
        :class="{
          'vdb-c-pointer-events-none vdb-c-opacity-20': status === 'inactive',
        }"
      >
        <div
          class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-center vdb-c-gap-6"
        >
          <a
            :href="config.primaryLink.href"
            :target="config.primaryLink.target || '_blank'"
            rel="noopener noreferrer"
            class="vdb-c-flex vdb-c-items-center vdb-c-text-white hover:vdb-c-text-white hover:vdb-c-no-underline"
          >
            <template v-if="config.primaryLink.icon">
              <img
                v-if="typeof config.primaryLink.icon === 'string'"
                :src="config.primaryLink.icon"
                alt="Primary Link Icon"
                class="vdb-c-mr-8 vdb-c-h-20 vdb-c-w-20"
              />
              <component
                v-else-if="typeof config.primaryLink.icon === 'object'"
                :is="config.primaryLink.icon"
                class="vdb-c-mr-8 vdb-c-h-20 vdb-c-w-20"
              />
            </template>
            {{ config.primaryLink.text }}
          </a>
        </div>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";

import Button from "../../buttons/Button.vue";

import AgentIcon from "../../icons/Agent.vue";
import ChatIcon from "../../icons/Chat.vue";
import ChevronDown from "../../icons/ChevronDown.vue";
import CollectionIcon from "../../icons/Collection.vue";
import ComposeIcon from "../../icons/Compose.vue";
import DeleteIcon from "../../icons/Delete.vue";
import PlusIcon from "../../icons/Plus.vue";
import CopyIcon from "../../icons/CopyIcon.vue";
import CheckIcon from "../../icons/Check.vue";
import DotVertical from "../../icons/DotVertical.vue";
import EditIcon from "../../icons/Edit.vue";
import Popper from "vue3-popper";

const props = defineProps({
  sessions: {
    type: Array,
    required: true,
  },
  collections: {
    type: Array,
    required: true,
  },
  agents: {
    type: Array,
    required: true,
  },
  status: {
    type: String,
    default: "active",
  },
  newSessionButtonStatus: {
    type: String,
    default: "active",
  },
  config: {
    type: Object,
    required: true,
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
  initialExploreAgentsOpen: {
    type: Boolean,
    default: true,
  },
  initialSessionsOpen: {
    type: Boolean,
    default: true,
  },
  sidebarSections: {
    type: Array,
    default: () => ["collections", "agents", "sessions"],
    validator: (value) => {
      return value.every((item) =>
        ["collections", "agents", "sessions"].includes(item),
      );
    },
  },
});

const showExploreAgents = ref(true);
const showSessions = ref(true);
const showCollections = ref(true);
const isExploreAgentsFocused = ref(false);
const exploreAgentsTimeout = ref(null);
const userClickedSessions = ref(false);
const userClickedExploreAgents = ref(false);
const userClickedCollections = ref(false);
const hoveredSession = ref(null);
const isMobile = ref(window?.innerWidth < 1024);
const isOpen = ref(false);
const hoveredCollection = ref(null);
const editingSessionId = ref(null);
const editingName = ref("");
const copiedSessionId = ref(null);
const copyFeedbackTimeout = ref(null);

const visibleSections = computed(() => {
  return props.sidebarSections;
});

const emit = defineEmits([
  "create-new-session",
  "session-click",
  "delete-session",
  "collection-click",
  "agent-click",
  "create-collection",
  "delete-collection",
  "update-session-name",
]);

const closeSidebar = () => {
  if (isMobile.value) {
    isOpen.value = false;
  }
};

const toggleExploreAgents = (value) => {
  userClickedExploreAgents.value = true;
  showExploreAgents.value =
    value !== undefined ? value : !showExploreAgents.value;
};

const toggleSessions = (value) => {
  userClickedSessions.value = true;
  showSessions.value = value !== undefined ? value : !showSessions.value;
};

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
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

const computedSelectedCollection = computed(() => {
  if (props.selectedCollection !== "default") {
    return props.selectedCollection;
  }
  return props.collections.length > 0 ? props.collections[0].id : null;
});

watch(
  () => props.initialSessionsOpen,
  (newValue) => {
    if (!userClickedSessions.value) {
      showSessions.value = newValue;
    }
  },
  { immediate: true },
);

watch(
  () => props.initialExploreAgentsOpen,
  (newValue) => {
    if (!userClickedExploreAgents.value) {
      showExploreAgents.value = newValue;
    }
  },
  { immediate: true },
);

watch(showExploreAgents, (newValue) => {
  if (newValue) {
    // triggerExploreAgentsFocusAnimation();
  }
});

defineExpose({
  toggleExploreAgents,
  toggleSessions,
  triggerExploreAgentsFocusAnimation,
  toggleSidebar,
});

const startEditing = (session) => {
  editingSessionId.value = session.session_id;
  editingName.value = session.name || "";
  nextTick(() => {
    const input = document.getElementById(`edit-input-${session.session_id}`);
    if (input) {
      input.focus();
      input.select();
    }
  });
};

const cancelEditing = () => {
  editingSessionId.value = null;
  editingName.value = "";
};

const saveSessionName = (session) => {
  if (editingSessionId.value !== session.session_id) return;
  const trimmed = (editingName.value || "").trim();
  emit("update-session-name", { sessionId: session.session_id, name: trimmed });
  cancelEditing();
};

const copySessionId = async (sessionId) => {
  try {
    await navigator.clipboard.writeText(String(sessionId));
    copiedSessionId.value = sessionId;
    if (copyFeedbackTimeout.value) {
      clearTimeout(copyFeedbackTimeout.value);
    }
    copyFeedbackTimeout.value = setTimeout(() => {
      copiedSessionId.value = null;
      copyFeedbackTimeout.value = null;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy session ID", error);
  }
};
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sidebar-section {
  overflow: auto;
}

/* Popper theme overrides for the session action menu */
.vdb-session-menu :deep(.popper) {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #000000;
  --popper-theme-border-color: #e5e5e5;
  --popper-theme-border-width: 1px;
  --popper-theme-border-radius: 12px;
  --popper-theme-padding: 6px;
  --popper-theme-box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  z-index: 50;
}

/* Fallback if CSS variables are not applied */
.vdb-session-menu .popper {
  background-color: #ffffff !important;
  color: #000000;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 6px !important;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.vdb-session-menu .popper:hover,
.vdb-session-menu .popper:hover > #arrow::before {
  background: #ffffff !important;
}

.popper > #arrow {
  z-index: -50;
}

/* The library uses #arrow for the element, ensure it inherits our variables */
.vdb-session-menu :deep(#arrow),
.vdb-session-menu :deep(#arrow::before) {
  background: var(--popper-theme-background-color, #ffffff) !important;
  border-color: var(--popper-theme-border-color, #e5e5e5) !important;
}
</style>
