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

          <!-- Main Layout with Static Header, Scrollable Content, and Static Footer -->
          <div class="vdb-c-flex vdb-c-flex-col vdb-c-h-full">
            <!-- Fixed Collection Header -->
            <div
              :class="`vdb-c-collection-header vdb-c-bg-white vdb-c-shadow vdb-c-sticky vdb-c-top-0 vdb-c-p-16 ${collectionHeaderClass}`"
            >
              <template v-if="$slots.header">
                <slot name="header" />
              </template>
              <template v-else>
              <CollectionHeader
                :collection-name="activeCollectionData?.name || 'Default Collection'"
                :video-name="activeVideoData?.name || null"
                :is-chat-screen="!isDefaultScreen"
                :header-config="headerConfig"
                @upload-button-click="showUploadDialog = true"
                @collection-click="handleCollectionClick(collectionId)"
              />
              </template>
            </div>

            <!-- Scrollable Message Container -->
            <div class="vdb-c-message-container vdb-c-flex-1 vdb-c-overflow-y-auto" ref="chatWindow">
              <template v-if="Object.keys(conversations).length === 0">
                <!-- Empty Container -->
                <div
                  v-if="showCollectionView"
                  class="vdb-c-w-full vdb-c-p-16 vdb-c-px-30"
                >
                  <collection-view
                    v-if="showCollectionView"
                    :collection-id="collectionId"
                    :collection-data="activeCollectionData"
                    :collection-videos="activeCollectionVideos"
                    @video-click="handleVideoClick"
                    @delete-video="promptDeleteVideo"

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
                  @delete-video="promptDeleteVideo"
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
            </div>

            <!-- Chat Input -->
            <div
              class="vdb-c-chat-input-container vdb-c-sticky vdb-c-bottom-0 vdb-c-bg-white"
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
    </div>

    <!-- Delete Session Dialog -->
    <DeleteSessionDialog
      :show-dialog="showDeleteDialog"
      @cancel-delete="showDeleteDialog = false; sessionToDelete = null;"
      @confirm-delete="confirmDeleteSession"
    ></DeleteSessionDialog>

    <!-- Success Banner -->    
    <SuccessBanner
      v-if="showSuccessBanner"
      :message="bannerMessage"
      @hide="showSuccessBanner = false"
    />

    <!-- Delete Video Dialog -->
    <DeleteVideoDialog
      :show-dialog="showDeleteVideoDialog"
      @cancel-delete="
        showDeleteVideoDialog = false;
        videoToDelete = null;
      "
      @confirm-delete="confirmDeleteVideo"
    />

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

import CollectionHeader from "./elements/CollectionHeader.vue";
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
import DeleteVideoDialog from "../modals/DeleteVideoModal.vue";
import SuccessBanner from "../atoms/SuccessBanner.vue";

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
  deleteCollection,
  refetchCollectionVideos,
  deleteVideo,
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
const showDeleteVideoDialog = ref(false);
const videoToDelete = ref(null);
const showSuccessBanner = ref(false);
const bannerMessage = ref("");

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

const collectionHeaderClass = computed(() => {
  if (Object.keys(conversations).length === 0) {
    // Default screen: 5/6 width
    return "vdb-c-w-5/6 vdb-c-mx-[8.5%] vdb-c-flex vdb-c-flex-col vdb-c-gap-32 vdb-c-p-16 md:vdb-c-p-32";
  }
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

const isDefaultScreen = computed(() => Object.keys(conversations).length === 0);

const dynamicHeaderText = computed(() => {
  const collectionName = activeCollectionData.value?.name || "Default Collection";
  const videoName = activeVideoData.value?.name || null;
  return isDefaultScreen.value
    ? collectionName
    : `${collectionName} > ${videoName || ""}`;
});

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

const promptDeleteVideo = (video) => {
  videoToDelete.value = video;
  showDeleteVideoDialog.value = true;
};

const confirmDeleteVideo = async () => {
  if (!videoToDelete.value) {
    console.error("No video to delete.");
    return;
  }

  showDeleteVideoDialog.value = false;

  const { collection_id, id } = videoToDelete.value;
  videoToDelete.value = null;

  try {
    await deleteVideo(collection_id, id);
    bannerMessage.value = "Video deleted successfully.";
    showSuccessBanner.value = true;
  } catch (error) {
    console.error(`Error deleting video: ${error.message}`);
    bannerMessage.value = "Error deleting video.";
    showSuccessBanner.value = true;
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
  deleteCollection,
});
</script>

<style>
/* General Layout Styling */
.vdb-c-chat-input-container {
  flex-shrink: 0;
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: white; /* Ensures the input container is clearly visible */
}

.vdb-c-message-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 94px;
}

/* Adjustments for Header and Parent Container */
.vdb-c-collection-header {
  background-color: white;
  position: sticky;
  top: 0;
}

.vdb-c-chat-parent {
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensures it occupies the full height */
  overflow: hidden; /* Prevents unwanted scrolling */
}

/* Media Queries for Responsiveness */
@media (max-width: 1024px) {
  .vdb-c-chat-input-container {
    height: 62px; /* Smaller height for tablets */
  }

  .vdb-c-message-container {
    padding-bottom: 62px; /* Adjust padding for smaller screens */
  }
}

@media (max-width: 768px) {
  .vdb-c-chat-input-container {
    height: 48px; /* Even smaller height for mobile devices */
  }

  .vdb-c-message-container {
    padding-bottom: 48px; /* Adjust padding for mobile */
  }
}

/* Scrollbar Styling */
.vdb-c-message-container::-webkit-scrollbar {
  width: 8px;
}

.vdb-c-message-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.vdb-c-message-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

/* Rotating Animation (Preserved) */
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
