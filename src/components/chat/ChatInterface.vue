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
        :selected-session="sessionId"
        :add-dummy-session="Object.keys(conversations).length === 0"
        :selected-collection="collectionId"
        :agents="agents"
        :sessions="sessions"
        :collections="collections"
        @create-new-session="createNewSession"
        @create-collection="showCreateCollectionModal = true"
        @delete-session="showDeleteSessionDialog"
        @delete-collection="promptDeleteCollection"
        @agent-click="
          if (!chatLoading) {
            handleTagAgent($event, false);
            handleAddMessage({ text: `@${$event.name} ` });
          }
        "
        @session-click="handleSessionClick"
        @collection-click="handleCollectionClick"
      />

      <!-- Main Content -->
      <div class="vdb-c-flex vdb-c-flex-1 vdb-c-flex-col">
        <div
          class="vdb-c-relative vdb-c-flex vdb-c-h-full vdb-c-flex-1 vdb-c-flex-col vdb-c-justify-between vdb-c-bg-white vdb-c-shadow-2 vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out md:vdb-c-w-full"
        >
          <div
            class="vdb-c-chat-parent vdb-c-relative vdb-c-flex vdb-c-flex-1 vdb-c-items-center vdb-c-justify-center vdb-c-overflow-hidden"
          >
            <setup-screen
              v-if="!isSetupComplete && configStatus !== null"
              :config-status="configStatus"
            />
            <section
              v-else
              ref="chatWindowRef"
              class="vdb-c-flex vdb-c-h-full vdb-c-max-h-full vdb-c-w-full vdb-c-flex-col vdb-c-items-center vdb-c-overflow-x-auto vdb-c-overflow-y-auto"
            >
              <!-- Header -->
              <div
                class="vdb-c-collection-header vdb-c-shadow vdb-c-sticky vdb-c-top-0 vdb-c-z-40 vdb-c-bg-white vdb-c-py-24"
                ref="headerRef"
                :class="{
                  'vdb-c-flex vdb-c-w-5/6 vdb-c-flex-col vdb-c-px-24':
                    Object.keys(conversations).length === 0,
                  'vdb-c-w-full vdb-c-px-30':
                    Object.keys(conversations).length > 0,
                }"
              >
                <template v-if="$slots.header">
                  <slot name="header" />
                </template>
                <template v-else>
                  <CollectionHeader
                    :collection-name="activeCollectionData?.name"
                    :video-name="activeVideoData?.name || null"
                    :is-chat-screen="!isDefaultScreen"
                    :header-config="headerConfig"
                    @upload-button-click="showUploadDialog = true"
                    @collection-click="handleCollectionClick(collectionId)"
                  />
                </template>
              </div>

              <!-- Main Layout, Scrollable Content, and Static Footer -->
              <div
                v-if="Object.keys(conversations).length === 0"
                class="vdb-c-w-5/6 vdb-c-p-24"
              >
                <collection-view
                  v-if="showCollectionView"
                  :collection-id="collectionId"
                  :collection-data="activeCollectionData"
                  :collection-videos="activeCollectionVideos"
                  @video-click="handleVideoClick"
                  @delete-video="promptDeleteVideo"
                  class="vdb-c-w-full vdb-c-transition-opacity vdb-c-duration-300 vdb-c-ease-in-out"
                />

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
              </div>

              <!-- Message Container -->
              <chat-message-container
                v-for="(key, i) in Object.keys(conversations)"
                :key="key"
                :conversation="conversations[key]"
                :search-term="chatInput"
                :is-static-page="isStaticPage"
                :is-last-conv="i === Object.keys(conversations).length - 1"
                class="vdb-c-px-60 vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out"
              />
            </section>
            <UploadNotifications ref="uploadNotificationsRef" />
          </div>

          <!-- Chat Input -->
          <div
            class="vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out"
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

    <NotificationCenter ref="notificationCenterRef" />

    <!-- Delete Session Dialog -->
    <ConfirmModal
      heading-text="Delete Session"
      description-text="Are you sure you want to delete this session?"
      action-button-text="Delete"
      cancel-button-text="Cancel"
      :show-dialog="showDeleteDialog"
      @cancel-delete="
        showDeleteDialog = false;
        sessionToDelete = null;
      "
      @confirm-delete="confirmDeleteSession"
    />

    <!-- Delete Video Dialog -->
    <ConfirmModal
      heading-text="Delete Video"
      description-text="Are you sure you want to delete this video? This action cannot be undone."
      action-button-text="Delete"
      cancel-button-text="Cancel"
      :show-dialog="showDeleteVideoDialog"
      @cancel-delete="
        showDeleteVideoDialog = false;
        videoToDelete = null;
      "
      @confirm-delete="confirmDeleteVideo"
    />

    <!-- Create Collection Modal-->
    <CreateCollectionModal
      :showDialog="showCreateCollectionModal"
      @cancel="showCreateCollectionModal = false"
      @create="promptCreateCollection"
    />

    <!-- Delete Collection Error Modal -->
    <DeleteCollectionErrorModal
      :isVisible="showDeleteErrorModal"
      @closeModal="showDeleteErrorModal = false"
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
import NotificationCenter from "./elements/NotificationCenter.vue";

import CollectionHeader from "./elements/CollectionHeader.vue";
import ConfirmModal from "../modals/ConfirmModal.vue";
import UploadModal from "../modals/UploadModal.vue";
import DeleteCollectionErrorModal from "../modals/DeleteCollectionErrorModal.vue";
import CreateCollectionModal from "../modals/CreateCollectionModal.vue";

import ChatSearchResults from "../message-handlers/ChatSearchResults.vue";
import ChatVideo from "../message-handlers/ChatVideo.vue";
import ChatVideos from "../message-handlers/ChatVideos.vue";
import ImageHandler from "../message-handlers/ImageHandler.vue";
import TextResponse from "../message-handlers/TextResponse.vue";

import CollectionIcon from "../icons/Collection.vue";
import DirectorIcon from "../icons/Director.vue";
import ExternalLink from "../icons/ExternalLink.vue";
import SearchIcon from "../icons/SearchIcon.vue";
import QueryIcon from "../icons/Query.vue";
import DeleteIcon from "../icons/Delete3.vue";
import CheckIcon from "../icons/Check.vue";

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
const notificationCenterRef = ref(null);

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
  generateImageUrl,
  uploadMedia,
  createCollection,
  deleteCollection,
  refetchCollectionVideos,
  deleteVideo,
} = useChatHook(props.chatHookConfig);

const {
  chatInput,
  chatAttachements,
  setChatInput,
  messageHandlers,
  registerMessageHandler,
} = useChatInterface();

// Watch chatAttachements for new uploads
watch(chatAttachements, async (newAttachements) => {
  for (const attachment of newAttachements) {
    if (attachment.upload && attachment.upload_status === "in_queue") {
      attachment.upload_status = "uploading";

      try {
        const uploadData = {
          source: attachment.image_data,
          sourceType: "file",
          collectionId: activeCollectionData.value?.id,
        };

        const res = await uploadMedia(uploadData);
        if (res.ok) {
          const uploadResData = await res.json();
          const generateUrlData = await generateImageUrl(
            uploadResData.collection_id,
            uploadResData.id,
          );

          // Update attachment with image data
          attachment.image_id = uploadResData.id;
          attachment.image_url = generateUrlData.data.url;
          attachment.upload_status = "complete";
        } else {
          attachment.upload_status = "error";
        }
      } catch (e) {
        attachment.upload_status = "error";
      }
    }
  }
});

registerMessageHandler("video", ChatVideo);
registerMessageHandler("videos", ChatVideos);
registerMessageHandler("text", TextResponse);
registerMessageHandler("search_results", ChatSearchResults);
registerMessageHandler("image", ImageHandler);

const isStaticPage = ref(false);
const chatWindowRef = ref(null);
const headerRef = ref(null);
const showDeleteVideoDialog = ref(false);
const videoToDelete = ref(null);
const showDeleteErrorModal = ref(false);

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
  const chatWindow = chatWindowRef.value;
  const header = headerRef.value;
  if (!chatWindow) return;
  nextTick(() => {
    const scroll =
      chatWindow.scrollHeight - chatWindow.clientHeight - header.clientHeight;
    chatWindow.scroll({
      top: scroll,
      behavior: "smooth",
    });
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
    handleAddMessage({ text: query.content });
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

const isDefaultScreen = computed(() => Object.keys(conversations).length === 0);

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
    handleAddMessage({ text: `@stream_video ${video.name}` });
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
    notificationCenterRef.value.addNotification("Video deleted successfully.", {
      type: "error",
      icon: DeleteIcon,
    });
  } catch (error) {
    console.error(`Error deleting video: ${error.message}`);
    notificationCenterRef.value.addNotification("Error deleting video", {
      type: "error",
      icon: DeleteIcon,
    });
  }
};

const showCreateCollectionModal = ref(false);

const promptCreateCollection = async (newCollection) => {
  showCreateCollectionModal.value = false;
  try {
    const createdCollection = await createCollection(
      newCollection.name,
      newCollection.description || " ",
    );
    notificationCenterRef.value.addNotification(
      "Collection has been created successfully!",
      {
        type: "success",
        icon: CheckIcon,
      },
    );
  } catch (error) {
    console.error("Error creating collection:", error.message);
    notificationCenterRef.value.addNotification("Failed to create collection", {
      type: "error",
    });
  }
};

const promptDeleteCollection = async (collection) => {
  try {
    await deleteCollection(collection?.id);
    notificationCenterRef.value.addNotification(
      "Collection deleted successfully.",
      {
        type: "error",
        icon: DeleteIcon,
      },
    );
  } catch (error) {
    if (
      error.message.includes("Invalid request: Your collection has non-zero")
    ) {
      showDeleteErrorModal.value = true;
      return;
    }
    console.error("Unexpected error deleting collection:", error);
  }
};

const handleAddMessage = async ({ text = "", images = [] }) => {
  if (!sessionId.value) {
    loadSession();
  }

  const content = [];
  if (text) {
    content.push({ type: "text", text: text });
  }
  if (images?.length > 0) {
    for (const image of images) {
      console.log("processing image", image);
      // const data = image.image_data;
      // const uploadData = {
      //   source: data,
      //   sourceType: "file",
      //   collectionId: activeCollectionData.value?.id,
      // };
      // let uploadResData = await uploadMedia(uploadData);
      // uploadResData = await uploadResData.json();
      // console.log("this is uploadResData", uploadResData);
      // let generateUrlData = await generateImageUrl(
      //   uploadResData.collection_id,
      //   uploadResData.id,
      // );
      // console.log("this is generateUrldata", generateUrlData);
      // content.push({
      //   type: "image",
      //   image_id: uploadResData.id,
      //   image_url: generateUrlData.data.url,
      // });
    }
  }

  addMessage({
    content: content,
    agents: taggedAgent.value,
  });
  taggedAgent.value = [];
};

defineExpose({
  chatInput,
  chatAttachements,
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
  chatAttachements,
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
/* #TODO: Scrollbar Styling */
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
