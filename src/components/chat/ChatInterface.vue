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
        class="vdb-c-w-1/5 vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out"
        :selected-session="currentSessionId"
        :selected-collection="currentCollectionId"
        :all-sessions="allSessions"
        :all-collections="allCollections"
        :links="links"
        :primary-link="primaryLink"
        @create-new-session="handleNewSessionClick"
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
                <transition>
                  <video-view
                    v-if="showVideoView"
                    :collection-id="currentCollectionId"
                    :video-id="currentVideoId"
                    class="vdb-c-transition-opacity vdb-c-duration-300 vdb-c-ease-in-out"
                  />

                  <collection-view
                    v-else-if="showCollectionView"
                    :collection-id="currentCollectionId"
                    @video-click="handleVideoClick"
                    class="vdb-c-transition-opacity vdb-c-duration-300 vdb-c-ease-in-out"
                  />

                  <onboarding-screen
                    v-else
                    :user-name="userName"
                    @query-card-click="handleQueryCardClick"
                    @agent-card-click="handleAgentCardClick"
                    class="vdb-c-transition-opacity vdb-c-duration-300 vdb-c-ease-in-out"
                  />
                </transition>
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
              :input-disabled="chatLoading"
              :placeholder="chatInputPlaceholder"
              @onSubmit="handleAddMessage"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, watch, provide, nextTick, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";

import { useVideoDBAgent } from "../hooks/useVideoDBAgent";
import { useChatInterface } from "../hooks/useChatInterface";

import CollectionView from "./CollectionView.vue";
import VideoView from "./VideoView.vue";
import Sidebar from "./elements/Sidebar.vue";
import OnboardingScreen from "./elements/OnboardingScreen.vue";
import ChatMessageContainer from "./ChatMessageContainer.vue";
import ChatInput from "./ChatInput.vue";

import ChatVideo from "../message-handlers/ChatVideo.vue";
import TextResponse from "../message-handlers/TextResponse.vue";
import ChatSearchResults from "../message-handlers/ChatSearchResults.vue";

const props = defineProps({
  chatInputPlaceholder: {
    type: String,
    default: "Ask Spielberg",
  },
  searchSuggestions: {
    type: Array,
    default: () => [],
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
  links: {
    type: Array,
    default: () => [
      {
        href: "https://docs.videodb.io",
        text: "Documentation",
      },
    ],
  },
  primaryLink: {
    type: Object,
    default: () => ({
      href: "https://console.videodb.io",
      text: "VideoDB Console",
    }),
  },
  userName: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["backBtnClick", "updateConversations"]);

const allSessions = reactive([]);
const allCollections = reactive([]);
const showCollectionView = ref(false);
const showVideoView = ref(false);

const useChatHook = props.customChatHook || useVideoDBAgent;
const {
  sessionId: currentSessionId,
  collectionId: currentCollectionId,
  videoId: currentVideoId,
  addMessage,
  conversations,
  chatLoading,
  loadSession,
  setCollectionId,
  setVideoId,
  fetchCollection,
  fetchCollections,
  fetchSession,
  fetchSessions,
  fetchCollectionVideo,
  fetchCollectionVideos,
} = useChatHook(props.chatHookConfig);

const { chatInput, setChatInput, messageHandlers, registerMessageHandler } =
  useChatInterface();

registerMessageHandler("video", ChatVideo);
registerMessageHandler("text", TextResponse);
registerMessageHandler("search_results", ChatSearchResults);

const isStaticPage = ref(false);
const chatWindow = ref(null);

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
  showCollectionView.value = false;
  showVideoView.value = false;
  // #TODO: Add a new entry in allSessionObject
  handleLoadSession();
};

const handleSessionClick = (sessionId) => {
  showCollectionView.value = false;
  showVideoView.value = false;
  handleLoadSession(sessionId);
};

const handleCollectionClick = (collectionId) => {
  setCollectionId(collectionId);
  showCollectionView.value = false;
  showVideoView.value = false;
  // #TODO: Add a new entry in allSessionObject
  handleLoadSession();
};

// --- Onboarding Screen Click Handlers ---
const handleQueryCardClick = (query) => {
  if (query.action === "show-collection") {
    showCollectionView.value = true;
  } else if (query.action === "chat") {
    setChatInput(query.text);
  }
};

const handleAgentCardClick = (agent) => {
  // setChatInput(agent.text);
};

// --- CollectionView/VideoView Click Handlers ---
const handleVideoClick = (video) => {
  setVideoId(video.id);
  showVideoView.value = true;
};

const handleLoadSession = (sessionId) => {
  let fetchPastMessages = true;
  if (!sessionId) {
    sessionId = uuidv4();
    fetchPastMessages = false;
  }
  loadSession(sessionId, fetchPastMessages);
  return sessionId;
};

const handleAddMessage = (content) => {
  if (!currentSessionId.value) {
    loadSession(uuidv4());
  }
  addMessage({ content });
};

// --- Mounted Hook ---
onMounted(() => {
  setCollectionId("default");
  fetchSessions().then((response) => {
    if (response.status === "success") {
      allSessions.push(...response.data);
    }
  });
  fetchCollections().then((response) => {
    if (response.status === "success") {
      allCollections.push(...response.data);
    }
  });
});

defineExpose({
  chatInput,
  chatLoading,
  conversations,
  messageHandlers,
  addMessage: handleAddMessage,
  loadSession,
  setChatInput,
  fetchSession,
  fetchSessions,
  fetchCollection,
  fetchCollections,
  fetchCollectionVideo,
  fetchCollectionVideos,
  registerMessageHandler,
});

provide("videodb-chat", {
  chatInput,
  chatLoading,
  conversations,
  messageHandlers,
  addMessage: handleAddMessage,
  loadSession,
  setChatInput,
  fetchSession,
  fetchSessions,
  fetchCollection,
  fetchCollections,
  fetchCollectionVideo,
  fetchCollectionVideos,
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
