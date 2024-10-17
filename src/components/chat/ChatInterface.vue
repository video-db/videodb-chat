<template>
  <section
    :class="{
      'vdb-c-fixed': size === 'full',
    }"
    class="vdb-c-inset-0 vdb-c-z-50 vdb-c-flex vdb-c-h-full vdb-c-w-full vdb-c-flex-col vdb-c-items-center vdb-c-justify-center vdb-c-overflow-y-hidden vdb-c-bg-black-64"
  >
    <div class="vdb-c-flex vdb-c-h-full vdb-c-w-full">
      <!-- Collapsible Sidebar -->
      <sidebar
        ref="sidebarRef"
        class="vdb-c-w-1/5 vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out"
        :config="sidebarConfig"
        :show-selected-collection="
          Object.keys(conversations).length === 0 &&
          !showVideoView &&
          !showCollectionView
        "
        :initial-sessions-open="!isFreshUser"
        :initial-collections-open="isFreshUser"
        :selected-session="sessionId"
        :add-dummy-session="Object.keys(conversations).length === 0"
        :selected-collection="collectionId"
        :agents="agents"
        :sessions="sessions"
        :collections="collections"
        @create-new-session="handleNewSessionClick"
        @agent-click="handleTagAgent"
        @session-click="handleSessionClick"
        @collection-click="handleCollectionClick"
      />

      <!-- Main Content -->
      <div class="vdb-c-flex vdb-c-flex-1 vdb-c-flex-col">
        <div
          class="vdb-c-relative vdb-c-flex-1 vdb-c-bg-white vdb-c-shadow-2 vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out md:vdb-c-w-full"
        >
          <div class="vdb-c-chat-parent vdb-c-relative vdb-c-overflow-hidden">
            <section
              ref="chatWindow"
              class="vdb-c-absolute vdb-c-left-0 vdb-c-top-0 vdb-c-flex vdb-c-h-full vdb-c-max-h-full vdb-c-w-full vdb-c-flex-col vdb-c-items-center vdb-c-overflow-x-auto vdb-c-overflow-y-auto"
            >
              <template v-if="Object.keys(conversations).length === 0">
                <!-- Empty Container -->
                <div
                  v-if="showVideoView || showCollectionView"
                  class="vdb-c-w-full vdb-c-p-16 vdb-c-px-30"
                >
                  <div
                    class="vdb-c-flex vdb-c-items-center vdb-c-gap-8 vdb-c-border-b vdb-c-border-roy vdb-c-py-12 vdb-c-text-lg vdb-c-text-black"
                  >
                    <span class="vdb-c-flex vdb-c-font-bold">
                      <span
                        v-if="collectionName"
                        class="vdb-c-cursor-pointer"
                        @click="
                          videoId.value = null;
                          showVideoView = false;
                        "
                      >
                        {{ collectionName }}
                      </span>
                      <span
                        v-else
                        class="vdb-c-inline-block vdb-c-h-20 vdb-c-w-100 vdb-c-animate-pulse vdb-c-rounded vdb-c-bg-roy"
                      ></span>
                    </span>
                    <span v-if="showVideoView"> > </span>
                    <span
                      v-if="showVideoView"
                      class="vdb-c-flex vdb-c-max-w-[300px] vdb-c-truncate"
                    >
                      <span v-if="videoName"> {{ videoName }} </span>
                      <span
                        v-else
                        class="vdb-c-inline-block vdb-c-h-20 vdb-c-w-100 vdb-c-animate-pulse vdb-c-rounded vdb-c-bg-[#EEEFF2]"
                      ></span>
                    </span>
                  </div>
                  <video-view
                    v-if="showVideoView"
                    :collection-id="collectionId"
                    :video-id="videoId"
                    :collection-data="activeCollectionData"
                    :video-data="activeVideoData"
                    class="vdb-c-transition-opacity vdb-c-duration-300 vdb-c-ease-in-out"
                  />

                  <collection-view
                    v-else-if="showCollectionView"
                    :collection-id="collectionId"
                    :collection-data="activeCollectionData"
                    :collection-videos="activeCollectionVideos"
                    @video-click="handleVideoClick"
                    class="vdb-c-transition-opacity vdb-c-duration-300 vdb-c-ease-in-out"
                  />
                </div>

                <default-screen
                  v-else
                  :agents="agents.slice(0, 2)"
                  :active-collection-data="activeCollectionData"
                  :show-onboarding-message="isFreshUser"
                  :action-card-queries="dynamicActionCards"
                  @query-card-click="handleQueryCardClick"
                  @agent-click="handleTagAgent"
                  @explore-agents-click="handleExploreAgentsClick"
                  class="vdb-c-transition-opacity vdb-c-duration-300 vdb-c-ease-in-out"
                />
              </template>

              <!-- Message Container -->
              <chat-message-container
                v-else
                v-for="(key, i) in Object.keys(conversations)"
                :key="key"
                :conversation="conversations[key]"
                :search-term="chatInput"
                :is-static-page="isStaticPage"
                :is-last-conv="i === Object.keys(conversations).length - 1"
                class="vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out"
              />
            </section>
          </div>

          <!-- chat input -->
          <div
            class="vdb-c-chat-input-container vdb-c-relative vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out"
          >
            <chat-input
              ref="chatInputRef"
              :agents="agents"
              :input-disabled="chatLoading"
              :placeholder="chatInputPlaceholder"
              :context-data="activeVideoData || activeCollectionData"
              @on-submit="handleAddMessage"
              @tag-agent="handleTagAgent($event, false)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, provide, ref, watch } from "vue";

import { useChatInterface } from "../hooks/useChatInterface";
import { useVideoDBAgent } from "../hooks/useVideoDBAgent";

import ChatInput from "./ChatInput.vue";
import ChatMessageContainer from "./ChatMessageContainer.vue";
import CollectionView from "./CollectionView.vue";
import VideoView from "./VideoView.vue";
import DefaultScreen from "./elements/DefaultScreen.vue";
import Sidebar from "./elements/Sidebar.vue";
import UploadVideoQueryCard from "./elements/UploadVideoQueryCard.vue";

import ChatSearchResults from "../message-handlers/ChatSearchResults.vue";
import ChatVideo from "../message-handlers/ChatVideo.vue";
import ImageHandler from "../message-handlers/ImageHandler.vue";
import TextResponse from "../message-handlers/TextResponse.vue";

import VideoDBLogo from "../icons/VideoDBLogo.vue";
import FileUploadIcon from "../icons/FileUpload.vue";
import EyeIcon from "../icons/Eye.vue";
import SpielbergIcon from "../icons/Spielberg2.vue";

const props = defineProps({
  chatInputPlaceholder: {
    type: String,
    default: "Ask Spielberg",
  },
  customChatHook: {
    type: Function,
    default: null,
  },
  chatHookConfig: {
    type: Object,
    default: () => ({
      socketUrl: "http://127.0.0.1:8000/chat",
      httpUrl: "http://127.0.0.1:8000",
      debug: false,
    }),
  },
  size: {
    type: String,
    default: "full",
    validator: (value) => ["full", "embedded"].includes(value),
  },
  sidebarConfig: {
    type: Object,
    default: () => ({
      icon: SpielbergIcon,
      links: [
        {
          href: "https://docs.videodb.io",
          text: "Documentation",
        },
      ],
      primaryLink: {
        href: "https://console.videodb.io",
        text: "VideoDB Console",
        icon: VideoDBLogo,
      },
    }),
  },
  defaultScreenConfig: {
    type: Object,
    default: () => ({
      actionCardQueries: null,
    }),
  },
});
const emit = defineEmits([]);

const sidebarRef = ref(null);
const chatInputRef = ref(null);

const showCollectionView = ref(false);
const showVideoView = ref(false);
const taggedAgent = ref([]);

const useChatHook = props.customChatHook || useVideoDBAgent;
const {
  sessionId,
  collectionId,
  videoId,
  collections,
  sessions,
  agents,
  activeCollectionData,
  activeCollectionVideos,
  activeVideoData,
  addMessage,
  conversations,
  loadSession,
} = useChatHook(props.chatHookConfig);

const { chatInput, setChatInput, messageHandlers, registerMessageHandler } =
  useChatInterface();

registerMessageHandler("video", ChatVideo);
registerMessageHandler("text", TextResponse);
registerMessageHandler("search_results", ChatSearchResults);
registerMessageHandler("image", ImageHandler);

const isStaticPage = ref(false);
const chatWindow = ref(null);

const collectionName = computed(() => activeCollectionData.value?.name);
const videoName = computed(() => activeVideoData.value?.name);
const isFreshUser = computed(() => {
  if (collections.value && activeCollectionVideos.value) {
    return (
      collections.value.length < 2 && activeCollectionVideos.value.length < 1
    );
  }
  return false;
});
const chatLoading = computed(() =>
  Object.values(conversations).some((conv) =>
    Object.values(conv).some(
      (content) => content.status === "progress" || content.clientLoading,
    ),
  ),
);
const dynamicActionCards = computed(() => {
  return (
    props.defaultScreenConfig.actionCardQueries ||
    (isFreshUser.value
      ? [
          {
            component: UploadVideoQueryCard,
            content: "Upload a video to this collection",
            type: "cta",
            action: "chat",
            icon: FileUploadIcon,
          },
          {
            content: "What are agents and How do they work ?",
            type: "primary",
            action: "chat",
          },
          {
            content:
              "How will I be charged for using VideoDB's integration on Spielberg?",
            type: "primary",
            action: "chat",
          },
          {
            content:
              "I'm not sure what Spielberg is about.Help me figure out what you can do.",
            type: "muted",
            action: "chat",
          },
        ]
      : [
          {
            content: "View all videos in this collection",
            type: "cta",
            action: "show-collection",
            icon: EyeIcon,
          },
          {
            content: "Upload a video to this collection",
            type: "primary",
            action: "chat",
          },
          {
            content: "Categorise the videos in my collection",
            type: "primary",
            action: "chat",
          },
          {
            content: "I'm not sure. Help me figure out what you can do",
            type: "muted",
            action: "chat",
          },
        ])
  );
});

const scrollToBottom = () => {
  const element = chatWindow.value;
  if (!element) return;
  nextTick(() => {
    element.scroll({ top: element.scrollHeight - 50, behavior: "smooth" });
  });
};

watch(chatLoading, (val) => {
  if (val) {
    scrollToBottom();
  }
});

// --- Sidebar Click Handlers ---
const handleNewSessionClick = () => {
  videoId.value = null;
  showCollectionView.value = false;
  showVideoView.value = false;
  taggedAgent.value = [];
  loadSession();
};

const handleSessionClick = (sessionId) => {
  showCollectionView.value = false;
  showVideoView.value = false;
  loadSession(sessionId);
};

const handleCollectionClick = (_collectionId) => {
  collectionId.value = _collectionId;
  videoId.value = null;
  showCollectionView.value = false;
  showVideoView.value = false;
  loadSession();
};

// --- Onboarding Screen Click Handlers ---
const handleQueryCardClick = (query) => {
  if (query.action === "show-collection") {
    showCollectionView.value = true;
    chatInput.value = "";
  } else if (query.action === "chat") {
    chatInput.value = query.content;
  }
};

const handleExploreAgentsClick = () => {
  sidebarRef.value.triggerExploreAgentsFocusAnimation();
  sidebarRef.value.toggleExploreAgents(true);
};

const handleTagAgent = (agent, addToInput = true) => {
  const agentName = agent.name || agent;
  if (agentName) {
    taggedAgent.value.push(agentName);
    if (addToInput) {
      chatInput.value =
        chatInput.value.trim() === ""
          ? `@${agentName}`
          : `${chatInput.value} @${agentName}`;
      chatInputRef.value.focus();
    }
  }
};

// --- CollectionView/VideoView Click Handlers ---
const handleVideoClick = (video) => {
  videoId.value = video.id;
  showVideoView.value = true;
};

const handleAddMessage = (content) => {
  if (!sessionId.value) {
    loadSession();
  }
  addMessage({
    content: [{ type: "text", text: content }],
    agents: taggedAgent.value,
  });
  taggedAgent.value = [];
};

defineExpose({
  chatInput,
  conversations,
  messageHandlers,
  addMessage,
  loadSession,
  setChatInput,
  registerMessageHandler,
});

provide("videodb-chat", {
  chatInput,
  chatLoading,
  conversations,
  messageHandlers,
  addMessage,
  loadSession,
  setChatInput,
  registerMessageHandler,
});
</script>

<style>
.vdb-c-chat-input-container {
  height: 94px;
}

.vdb-c-chat-parent {
  height: calc(100% - 94px);
}

.vdb-c-chat-cont {
  border: 10px solid white;
}

@media (max-width: 768px) {
  .vdb-c-chat-input-container {
    height: 62px;
  }
  .vdb-c-chat-parent {
    height: calc(100% - 62px);
  }
}

.vdb-c-rsb {
  font-size: 12px !important;
}

@-webkit-keyframes rotating /* Safari and Chrome */ {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.vdb-c-rotating {
  -webkit-animation: rotating 2s linear infinite;
  -moz-animation: rotating 2s linear infinite;
  -ms-animation: rotating 2s linear infinite;
  -o-animation: rotating 2s linear infinite;
  animation: rotating 2s linear infinite;
}
</style>
