<template>
  <section
    :class="{
      'vdb-c-fixed': size === 'full',
    }"
    class="vdb-c-inset-0 vdb-c-z-50 vdb-c-flex vdb-c-h-full vdb-c-w-full vdb-c-flex-col vdb-c-items-center vdb-c-justify-center vdb-c-overflow-y-hidden vdb-c-bg-black-64"
    tabindex="0"
  >
    <div class="vdb-c-flex vdb-c-h-full vdb-c-w-full">
      <!-- Collapsible Sidebar -->
      <Sidebar
        ref="sidebarRef"
        :status="
          configStatus !== null && isSetupComplete ? 'active' : 'inactive'
        "
        :new-session-button-status="
          Object.keys(conversations).length === 0 && !showCollectionView
            ? 'inactive'
            : 'active'
        "
        :config="sidebarConfig"
        :show-selected-collection="
          Object.keys(conversations).length === 0 && !showCollectionView
        "
        :initial-sessions-open="!isFreshUser"
        :initial-explore-agents-open="!isFreshUser"
        :initial-collections-open="!isFreshUser"
        :selected-session="sessionId"
        :add-dummy-session="Object.keys(conversations).length === 0"
        :selected-collection="collectionId"
        :agents="agents"
        :sessions="sessions"
        :collections="collections"
        @create-new-session="createNewSession"
        @delete-session="showDeleteSessionDialog"
        @agent-click="
          if (!chatLoading) {
            handleTagAgent($event, false);
            handleAddMessage(`@${$event.name} `);
          }
        "
        @session-click="handleSessionClick"
        @collection-click="handleCollectionClick"
      />

      <!-- Main Content -->
      <div class="vdb-c-flex vdb-c-flex-1 vdb-c-flex-col">
        <div
          class="vdb-c-relative vdb-c-flex-1 vdb-c-bg-white vdb-c-shadow-2 vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out md:vdb-c-w-full"
        >
          <div
            class="vdb-c-flex vdb-c-items-center vdb-c-justify-center vdb-c-pt-24 lg:vdb-c-hidden"
          >
            <director-icon />
          </div>
          <div class="vdb-c-chat-parent vdb-c-relative vdb-c-overflow-hidden">
            <div v-if="configStatus === null"></div>
            <setup-screen
              v-else-if="!isSetupComplete"
              :config-status="configStatus"
            />
            <section
              v-else-if="isSetupComplete"
              ref="chatWindow"
              class="vdb-c-absolute vdb-c-left-0 vdb-c-top-0 vdb-c-flex vdb-c-h-full vdb-c-max-h-full vdb-c-w-full vdb-c-flex-col vdb-c-items-center vdb-c-overflow-x-auto vdb-c-overflow-y-auto"
            >
              <template v-if="Object.keys(conversations).length === 0">
                <!-- Empty Container -->
                <div
                  v-if="showCollectionView"
                  class="vdb-c-w-full vdb-c-p-16 vdb-c-px-30"
                >
                  <div
                    class="vdb-c-flex vdb-c-items-center vdb-c-gap-8 vdb-c-border-b vdb-c-border-roy vdb-c-py-12 vdb-c-text-lg vdb-c-text-black"
                  >
                    <span class="vdb-c-flex vdb-c-font-bold">
                      <span
                        v-if="collectionName"
                        class="vdb-c-cursor-pointer"
                        @click="videoId = null"
                      >
                        {{ collectionName }}
                      </span>
                      <span
                        v-else
                        class="vdb-c-inline-block vdb-c-h-20 vdb-c-w-100 vdb-c-animate-pulse vdb-c-rounded vdb-c-bg-roy"
                      ></span>
                    </span>
                  </div>
                  <collection-view
                    v-if="showCollectionView"
                    :collection-id="collectionId"
                    :collection-data="activeCollectionData"
                    :collection-videos="activeCollectionVideos"
                    @video-click="handleVideoClick"
                    class="vdb-c-transition-opacity vdb-c-duration-300 vdb-c-ease-in-out"
                  />
                </div>

                <default-screen
                  v-else
                  class="vdb-c-transition-opacity vdb-c-duration-300 vdb-c-ease-in-out"
                  :header-config="headerConfig"
                  :collection-data="activeCollectionData"
                  :action-card-queries="dynamicActionCards"
                  :show-demo-videos="
                    isFreshUser ||
                    (activeCollectionData &&
                      activeCollectionVideos?.length === 0)
                  "
                  :preview-videos="
                    isFreshUser ||
                    (activeCollectionData &&
                      activeCollectionVideos?.length === 0)
                      ? defaultScreenConfig.demoVideos?.slice(0, 4)
                      : activeCollectionVideos?.slice(0, 4)
                  "
                  @query-card-click="handleQueryCardClick"
                  @video-click="handleVideoClick"
                  @upload-button-click="showUploadDialog = true"
                  @view-all-videos-click="handleViewAllVideosClick"
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
            <UploadNotifications ref="uploadNotificationsRef" />
          </div>

          <!-- chat input -->
          <div
            class="vdb-c-chat-input-container vdb-c-relative vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out"
            :class="{
              'vdb-c-pointer-events-none vdb-c-opacity-20': !(
                configStatus !== null && isSetupComplete
              ),
            }"
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

    <!-- Delete Session Dialog -->
    <DeleteSessionDialog
      :show-dialog="showDeleteDialog"
      @cancel-delete="
        showDeleteDialog = false;
        sessionToDelete = null;
      "
      @confirm-delete="confirmDeleteSession"
    ></DeleteSessionDialog>

    <!-- Upload Dialog -->
    <UploadModal
      :show-upload-dialog="showUploadDialog"
      :default-selected-collection-id="activeCollectionData?.id"
      :collections="collections"
      @upload="handleUpload"
      @cancel-upload="showUploadDialog = false"
    />
  </section>
</template>

<script setup>
import { computed, nextTick, provide, ref, watch } from "vue";

import { useChatInterface } from "../hooks/useChatInterface";
import { useVideoDBAgent } from "../hooks/useVideoDBAgent";

import ChatInput from "./ChatInput.vue";
import ChatMessageContainer from "./ChatMessageContainer.vue";
import CollectionView from "./CollectionView.vue";
import DefaultScreen from "./elements/DefaultScreen.vue";
import SetupScreen from "./elements/SetupScreen.vue";
import Sidebar from "./elements/Sidebar.vue";
import UploadNotifications from "./elements/UploadNotifications.vue";
import UploadVideoQueryCard from "./elements/UploadVideoQueryCard.vue";

import UploadModal from "../modals/UploadModal.vue";
import DeleteSessionDialog from "../modals/DeleteSessionModal.vue";
import ChatSearchResults from "../message-handlers/ChatSearchResults.vue";
import ChatVideo from "../message-handlers/ChatVideo.vue";
import ChatVideos from "../message-handlers/ChatVideos.vue";
import ImageHandler from "../message-handlers/ImageHandler.vue";
import TextResponse from "../message-handlers/TextResponse.vue";

import CollectionIcon from "../icons/Collection.vue";
import DirectorIcon from "../icons/Director.vue";
import ExternalLink from "../icons/ExternalLink.vue";
import FileUploadIcon from "../icons/FileUpload.vue";
import SearchIcon from "../icons/SearchIcon.vue";
import QueryIcon from "../icons/Query.vue";

const props = defineProps({
  chatInputPlaceholder: {
    type: String,
    default: "Ask Director",
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
  headerConfig: {
    type: Object,
    default: () => ({
      uploadButton: true,
    }),
  },
  sidebarConfig: {
    type: Object,
    default: () => ({
      icon: DirectorIcon,
      links: [
        {
          href: "https://www.youtube.com/playlist?list=PLhxAMFLSSK039xl1UgcZmoFLnb-qNRYQw",
          text: "Watch Demos",
          icon: ExternalLink,
        },
        {
          href: "https://console.videodb.io",
          text: "VideoDB Console",
        },
      ],
    }),
  },
  defaultScreenConfig: {
    type: Object,
    default: () => ({
      actionCardQueries: null,
      demoVideos: [
        {
          id: 1,
          external_url: "https://www.youtube.com/watch?v=Dncn_0RWrro",
          thumbnail_url:
            "https://raw.githubusercontent.com/video-db/videodb-cookbook-assets/main/images/thumbnail_automated.png",
        },
        {
          id: 2,
          external_url: "https://www.youtube.com/watch?v=bct8Vvl2acU",
          thumbnail_url:
            "https://raw.githubusercontent.com/video-db/videodb-cookbook-assets/main/images/thumbnail_gen_ai.png",
        },
        {
          id: 3,
          external_url: "https://www.youtube.com/watch?v=KcoA0eio1Zo",
          thumbnail_url:
            "https://raw.githubusercontent.com/video-db/videodb-cookbook-assets/main/images/thumbnail_profanity.png",
        },
        {
          id: 4,
          external_url: "https://www.youtube.com/watch?v=7J7oBIv4eOY",
          thumbnail_url:
            "https://raw.githubusercontent.com/video-db/videodb-cookbook-assets/main/images/thumbnail_keyword.png",
        },
      ],
    }),
  },
});
const emit = defineEmits([]);

const sidebarRef = ref(null);
const chatInputRef = ref(null);
const uploadNotificationsRef = ref(null);

const showCollectionView = ref(false);
const taggedAgent = ref([]);

const useChatHook = props.customChatHook || useVideoDBAgent;
const {
  configStatus,
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
  deleteSession,
  conversations,
  loadSession,
  uploadMedia,
  refetchCollectionVideos,
} = useChatHook(props.chatHookConfig);

const { chatInput, setChatInput, messageHandlers, registerMessageHandler } =
  useChatInterface();

registerMessageHandler("video", ChatVideo);
registerMessageHandler("videos", ChatVideos);
registerMessageHandler("text", TextResponse);
registerMessageHandler("search_results", ChatSearchResults);
registerMessageHandler("image", ImageHandler);

const isStaticPage = ref(false);
const chatWindow = ref(null);

const isSetupComplete = computed(() => {
  return (
    typeof configStatus.value === "object" &&
    configStatus.value !== null &&
    Object.values(configStatus.value).every((value) => value === true)
  );
});

const collectionName = computed(() => activeCollectionData.value?.name);
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
    (!isFreshUser.value &&
    activeCollectionData.value &&
    activeCollectionVideos?.value?.length > 0
      ? [
          {
            component: UploadVideoQueryCard,
            content:
              "Upload <a href='https://www.youtube.com/watch?v=FgrO9ADPZSA' target='_blank'>https://youtu.be/FgrO9ADPZSA</a> and generate a bullet point summary.",
            type: "primary",
            action: "chat",
            icon: QueryIcon,
          },
          {
            content: "What are the pre-built agents I can use right now?",
            type: "primary",
            action: "chat",
          },
          {
            content: "Categorize all videos in this collection",
            type: "primary",
            action: "chat",
            icon: CollectionIcon,
          },
        ]
      : [
          {
            component: UploadVideoQueryCard,
            content:
              "Upload <a href='https://www.youtube.com/watch?v=FgrO9ADPZSA' target='_blank'>https://youtu.be/FgrO9ADPZSA</a> and generate a bullet point summary.",
            type: "primary",
            action: "chat",
            icon: QueryIcon,
          },
          {
            content: "What are the pre-built agents I can use right now?",
            type: "primary",
            action: "chat",
          },
          {
            content: "Show me how the search agent works? ",
            type: "primary",
            action: "chat",
            icon: SearchIcon,
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
const createNewSession = () => {
  videoId.value = null;
  showCollectionView.value = false;
  taggedAgent.value = [];
  loadSession();
};

const handleSessionClick = (sessionId) => {
  showCollectionView.value = false;
  loadSession(sessionId);
};

const handleCollectionClick = (_collectionId) => {
  collectionId.value = _collectionId;
  videoId.value = null;
  showCollectionView.value = false;
  loadSession();
};

const showDeleteDialog = ref(false);
const sessionToDelete = ref(null);

const showDeleteSessionDialog = (_sessionId) => {
  sessionToDelete.value = _sessionId;
  showDeleteDialog.value = true;
};

const confirmDeleteSession = () => {
  if (sessionToDelete.value === sessionId.value) {
    createNewSession();
  }
  deleteSession(sessionToDelete.value);
  showDeleteDialog.value = false;
  sessionToDelete.value = null;
};

// --- Upload Dialog Handlers ---
const showUploadDialog = ref(false);
const handleUpload = async (uploadData) => {
  showUploadDialog.value = false;
  let name = "Media";
  if (uploadData.sourceType === "file") {
    name = uploadData.source.name;
  } else {
    name = uploadData.source.url;
  }
  const uploadId = uploadNotificationsRef.value.addUpload(name);
  try {
    const res = await uploadMedia(uploadData);
    if (res.ok) {
      uploadNotificationsRef.value.updateUploadStatus(uploadId, "success");
      refetchCollectionVideos();
    } else {
      uploadNotificationsRef.value.updateUploadStatus(uploadId, "error");
    }
  } catch (e) {
    uploadNotificationsRef.value.updateUploadStatus(uploadId, "error");
  }
};

// --- Handle Default Screen Click Handlers ---
const handleQueryCardClick = (query) => {
  if (query.action === "show-collection") {
    showCollectionView.value = true;
    chatInput.value = "";
  } else if (query.action === "chat") {
    chatInput.value = "";
    handleAddMessage(query.content);
  }
};

const handleViewAllVideosClick = (redirectTo = "") => {
  if (redirectTo.includes("youtube.com")) {
    window.open(redirectTo, "_blank");
  } else {
    showCollectionView.value = true;
    chatInput.value = "";
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
  if (video.external_url) {
    window.open(video.external_url, "_blank");
  } else {
    videoId.value = video.id;
    handleAddMessage(`@stream_video ${video.name}`);
  }
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
  chatInputRef,
  conversations,
  messageHandlers,
  addMessage,
  loadSession,
  activeCollectionData,
  activeCollectionVideos,
  createNewSession,
  setChatInput,
  registerMessageHandler,
  uploadMedia,
});

provide("videodb-chat", {
  chatInput,
  chatLoading,
  conversations,
  messageHandlers,
  addMessage,
  loadSession,
  activeCollectionData,
  activeCollectionVideos,
  setChatInput,
  registerMessageHandler,
  uploadMedia,
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

@media (max-width: 1024px) {
  .vdb-c-chat-parent {
    height: calc(100% - 94px - 64px);
  }
}

@media (max-width: 768px) {
  .vdb-c-chat-input-container {
    height: 62px;
  }
  .vdb-c-chat-parent {
    height: calc(100% - 62px - 64px);
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
