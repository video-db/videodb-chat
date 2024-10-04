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
        class="vdb-c-w-1/5"
        :all-sessions="allSessions"
        :is-sidebar-open="isSidebarOpen"
        @toggle="toggleSidebar"
        @create-new-session="handleCreateNewSession"
      />

      <!-- Main Content -->
      <div class="vdb-c-flex vdb-c-flex-1 vdb-c-flex-col">
        <div
          class="vdb-c-relative vdb-c-flex-1 vdb-c-bg-white vdb-c-p-10 vdb-c-shadow-2 md:vdb-c-w-full"
        >
          <div class="vdb-c-chat-parent vdb-c-relative vdb-c-overflow-hidden">
            <section
              ref="chatWindow"
              class="vdb-c-absolute vdb-c-left-0 vdb-c-top-0 vdb-c-flex vdb-c-h-full vdb-c-max-h-full vdb-c-w-full vdb-c-flex-col vdb-c-items-center vdb-c-overflow-x-auto vdb-c-overflow-y-auto"
            >
              <!-- Empty Container -->
              <template v-if="Object.keys(conversations).length === 0">
                <onboarding-screen
                  v-if="currentCollectionId && !currentVideoId"
                  user-name="Sam"
                  @query-card-click="handleQueryCardClick"
                  @agent-card-click="handleAgentCardClick"
                />
                <video-view
                  v-else-if="currentCollectionId && currentVideoId"
                  :collection-id="currentCollectionId"
                  :video-id="currentVideoId"
                />
              </template>

              <!-- Message Container -->
              <chat-message-container
                v-else
                v-for="(key, i) in Object.keys(conversations)"
                :key="key"
                :conversation="conversations[key]"
                :user-image="userImage"
                :assistant-image="assistantImage"
                :search-term="chatInput"
                :is-static-page="isStaticPage"
                :is-last-conv="i === Object.keys(conversations).length - 1"
              />
            </section>
          </div>

          <!-- chat input -->
          <div class="vdb-c-chat-input-container vdb-c-relative">
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
import { ref, computed, watch, provide, nextTick, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";

import { useVideoDBAgent } from "../hooks/useVideoDBAgent";
import { useChatInterface } from "../hooks/useChatInterface";

import ChatInput from "./ChatInput.vue";
import ChatMessageContainer from "./ChatMessageContainer.vue";
import Sidebar from "./elements/Sidebar.vue";
import OnboardingScreen from "./elements/OnboardingScreen.vue";
import FollowUpContainer from "./elements/FollowUpContainer.vue";
import ChatSearchResults from "../message-handlers/ChatSearchResults.vue";
import ChatVideo from "../message-handlers/ChatVideo.vue";
import ChatUser from "../icons/ChatUser.vue";
import AssistantIcon from "../icons/AssistantIcon.vue";
import SpextLogoBlue from "../icons/SpextLogoBlue.vue";
import CollectionView from "./CollectionView.vue";
import VideoView from "./VideoView.vue";

const props = defineProps({
  userImage: {
    type: [String, Object],
    default: ChatUser,
  },
  assistantImage: {
    type: [String, Object],
    default: AssistantIcon,
  },
  emptyContainerLogo: {
    type: [String, Object],
    default: SpextLogoBlue,
  },
  chatInputPlaceholder: {
    type: String,
    default: "Ask a question",
  },
  searchSuggestions: {
    type: Array,
    default: () => [],
  },
  shareUrl: {
    type: String,
    default: "",
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
  collectionId: {
    type: String,
    default: null,
  },
  videoId: {
    type: String,
    default: null,
  },
  sessionId: {
    type: String,
    default: null,
  },
});

const currentCollectionId = ref(props.collectionId);
const currentVideoId = ref(props.videoId);
const currentSessionId = ref(props.sessionId);
const isSidebarOpen = ref(false);
const allSessions = ref([]);

const useChatHook = props.customChatHook || useVideoDBAgent;
const {
  session,
  addMessage,
  conversations,
  chatLoading,
  loadSession,
  setCollectionId,
  setVideoId,
  fetchCollection,
  fetchAllSessions,
  fetchCollectionVideo,
  fetchCollectionVideos,
} = useChatHook(props.chatHookConfig);

const { chatInput, setChatInput, messageHandlers, registerMessageHandler } =
  useChatInterface();

if (!props.customChatHook) {
  registerMessageHandler("search", ChatSearchResults);
  registerMessageHandler("search", ChatVideo);
  registerMessageHandler("subtitle", ChatVideo);
  registerMessageHandler("editing", ChatVideo);
}

const isStaticPage = ref(false);
const chatWindow = ref(null);
const sessionLoaded = ref(false);

const scrollToBottom = () => {
  const element = chatWindow.value;
  if (!element) return;
  nextTick(() => {
    element.scroll({ top: element.scrollHeight - 50, behavior: "smooth" });
  });
};

watch(conversations, (val) => {
  emit("updateConversations", val);
});

watch(chatLoading, (val) => {
  if (val) {
    scrollToBottom();
  }
});

watch(
  () => props.collectionId,
  (newVal) => {
    currentCollectionId.value = newVal;
  },
);

watch(
  () => props.videoId,
  (newVal) => {
    currentVideoId.value = newVal;
  },
);

watch(currentCollectionId, (newVal) => {
  setCollectionId(newVal);
});

watch(currentVideoId, (newVal) => {
  setVideoId(newVal);
});

const showShareButton = computed(
  () => Object.keys(conversations).length && props.shareUrl,
);

const emit = defineEmits(["backBtnClick", "updateConversations"]);

const handleFollowUp = (val) => {
  if (val.text) {
    handleAddMessage(val.text);
  }
};

const handleVideoClick = (data) => {
  currentVideoId.value = data.id;
};

const handleAgentCardClick = (agent) => {
  console.log(agent);
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const viewMyCollection = () => {
  const newSessionId = uuidv4();
  loadSession(newSessionId);
  currentVideoId.value = null;
};

// #TODO: accept whole object
const handleAddMessage = (content) => {
  if (!sessionLoaded.value && Object.keys(conversations).length === 0) {
    const _sessionId = currentSessionId.value || uuidv4();
    loadSession(_sessionId);
    currentCollectionId.value = _sessionId;
    sessionLoaded.value = true;

  }
  addMessage({ content });
};

const handleQueryCardClick = (query) => {
  setChatInput(query.text);
};

const handleCreateNewSession = () => {
  const newSessionId = uuidv4();
  loadSession(newSessionId);
  currentSessionId.value = newSessionId;
  sessionLoaded.value = true;
};

// #TODO: figure out how can loadSession work in both cases, when just sessionId is provided, and when collectionId and videoId are also provided
onMounted(() => {
  if (props.sessionId) {
    loadSession(props.sessionId);
    sessionLoaded.value = true;
  }
  if (props.collectionId) {
    setCollectionId(props.collectionId);
  }
  if (props.videoId) {
    setVideoId(props.videoId);
  }
  fetchAllSessions().then((response) => {
    if (response.status === "success") {
      allSessions.value = response.data;
    }
  });
});

defineExpose({
  session,
  chatInput,
  chatLoading,
  conversations,
  messageHandlers,
  addMessage: handleAddMessage,
  loadSession,
  setChatInput,
  fetchAllSessions,
  fetchCollection,
  fetchCollectionVideo,
  fetchCollectionVideos,
  registerMessageHandler,
});

provide("videodb-chat", {
  session,
  chatInput,
  chatLoading,
  conversations,
  messageHandlers,
  addMessage: handleAddMessage,
  loadSession,
  setChatInput,
  fetchAllSessions,
  fetchCollection,
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
