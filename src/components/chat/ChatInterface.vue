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
        v-if="sidebarConfig.enabled"
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
        @update-session-name="handleUpdateSessionName"
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
      <div
        class="vdb-c-flex vdb-c-h-screen vdb-c-w-full vdb-c-flex-1 vdb-c-flex-col"
      >
        <div
          class="vdb-c-relative vdb-c-flex vdb-c-h-full vdb-c-flex-1 vdb-c-flex-col vdb-c-justify-between vdb-c-bg-white vdb-c-shadow-2 vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out md:vdb-c-w-full"
        >
          <div
            :class="[
              'vdb-c-chat-parent vdb-c-relative vdb-c-flex vdb-c-flex-1 vdb-c-items-center vdb-c-justify-center vdb-c-overflow-hidden',
            ]"
          >
            <setup-screen
              v-if="!isSetupComplete && configStatus !== null"
              :config-status="configStatus"
            />
            <section
              v-else
              class="vdb-c-flex vdb-c-h-full vdb-c-max-h-[calc(100vh-90px)] vdb-c-w-full vdb-c-flex-1 vdb-c-flex-col vdb-c-items-center vdb-c-overflow-x-auto vdb-c-overflow-y-hidden"
            >
              <!-- Header -->
              <div
                class="vdb-c-sticky vdb-c-top-0 vdb-c-z-40 vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-center vdb-c-bg-white vdb-c-px-12 md:vdb-c-px-[30px]"
                ref="headerRef"
              >
                <template v-if="$slots.header">
                  <slot name="header" />
                </template>
                <template v-else>
                  <Header
                    :is-sidebar-enabled="sidebarConfig.enabled"
                    :collection-name="activeCollectionData?.name || null"
                    :video-name="activeVideoData?.name || null"
                    :headerState="isDefaultScreen ? 'primary' : 'secondary'"
                    :header-config="headerConfig"
                    class="vdb-c-header vdb-c-w-full vdb-c-transition-shadow"
                    :class="{
                      'vdb-c-pl-16 vdb-c-pr-24 md:vdb-c-pl-32 md:vdb-c-pr-60 2xl:vdb-c-pl-60 2xl:vdb-c-pr-80':
                        isDefaultScreen,
                      'vdb-c-border-b-2 vdb-c-border-roy': isCollectionView,
                      'header-shadow':
                        isScrolled && !isCollectionView && !isDefaultScreen,
                    }"
                    @toggle-sidebar="toggleSidebar"
                    @upload-button-click="showUploadDialog = true"
                    @collection-click="handleCollectionClick(collectionId)"
                  />
                </template>
              </div>

              <!-- Main Layout, Scrollable Content, and Static Footer -->
              <div
                v-if="Object.keys(conversations).length === 0"
                :class="
                  showCollectionView
                    ? 'vdb-c-w-[100%] vdb-c-py-16'
                    : 'vdb-c-w-[90%] vdb-c-p-16'
                "
              >
                <collection-view
                  v-if="showCollectionView"
                  :collection-id="collectionId"
                  :collection-data="activeCollectionData"
                  :collection-videos="activeCollectionVideos"
                  :collection-audios="activeCollectionAudios"
                  :collection-images="activeCollectionImages"
                  :get-image-url="generateImageUrl"
                  :get-audio-url="generateAudioUrl"
                  @video-click="handleVideoClick"
                  @delete-video="promptDeleteVideo"
                  @delete-audio="promptDeleteAudio"
                  @delete-image="promptDeleteImage"
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
                      activeCollectionVideos?.length === 0 &&
                      activeCollectionImages?.length === 0 &&
                      activeCollectionAudios?.length === 0)
                  "
                  :enable-video-view="props.defaultScreenConfig.enableVideoView"
                  :is-content-loading="isContentLoading"
                  :preview-media="
                    isFreshUser ||
                    (activeCollectionData &&
                      activeCollectionVideos?.length === 0 &&
                      activeCollectionImages?.length === 0 &&
                      activeCollectionAudios?.length === 0)
                      ? defaultScreenConfig.demoVideos?.slice(0, 4)
                      : [
                          ...(activeCollectionVideos || []),
                          ...(activeCollectionAudios || []),
                          ...(activeCollectionImages || []),
                        ].slice(0, 4)
                  "
                  :get-image-url="generateImageUrl"
                  :get-audio-url="generateAudioUrl"
                  @query-card-click="handleQueryCardClick"
                  @video-click="handleVideoClick"
                  @delete-video="promptDeleteVideo"
                  @delete-audio="promptDeleteAudio"
                  @delete-image="promptDeleteImage"
                  @upload-button-click="showUploadDialog = true"
                  @view-all-videos-click="handleViewAllVideosClick"
                />
              </div>

              <!-- Message Container -->
              <div
                class="vdb-c-relative vdb-c-flex vdb-c-w-full vdb-c-flex-1 vdb-c-overflow-hidden"
              >
                <!-- Chat messages (scrollable area) -->
                <div
                  ref="chatWindowRef"
                  class="scrollbar-hide vdb-c-h-full vdb-c-w-full vdb-c-overflow-y-auto"
                >
                  <chat-message-container
                    v-for="(key, i) in Object.keys(conversations)"
                    :key="key"
                    :conversation="conversations[key]"
                    :search-term="chatInput"
                    :is-static-page="isStaticPage"
                    :is-last-conv="i === Object.keys(conversations).length - 1"
                    class="vdb-c-px-30 vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out md:vdb-c-px-60"
                    :class="{
                      'last-conv-height':
                        i === Object.keys(conversations).length - 1,
                    }"
                  />
                  <div class="vdb-c-h-[90px]"></div>
                </div>

                <component
                  v-if="canvasState.show"
                  :is="canvasHandlers[canvasState.type]"
                  :content="canvasState.content"
                  :onClose="closeCanvas"
                  :isOpen="canvasState.show"
                />
              </div>
            </section>
            <UploadNotifications ref="uploadNotificationsRef" />
          </div>

          <!-- Chat Input -->
          <div
            class="vdb-c-chat-input-container vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out"
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

    <!-- Delete Image Dialog -->
    <ConfirmModal
      heading-text="Delete Image"
      description-text="Are you sure you want to delete this image? This action cannot be undone."
      action-button-text="Delete"
      cancel-button-text="Cancel"
      :show-dialog="showDeleteImageDialog"
      @cancel-delete="
        showDeleteImageDialog = false;
        imageToDelete = null;
      "
      @confirm-delete="confirmDeleteImage"
    />

    <!-- Delete Audio Dialog -->
    <ConfirmModal
      heading-text="Delete Audio"
      description-text="Are you sure you want to delete this audio? This action cannot be undone."
      action-button-text="Delete"
      cancel-button-text="Cancel"
      :show-dialog="showDeleteAudioDialog"
      @cancel-delete="
        showDeleteAudioDialog = false;
        audioToDelete = null;
      "
      @confirm-delete="confirmDeleteAudio"
    />

    <!-- Create Collection Modal-->
    <CreateCollectionModal
      :showDialog="showCreateCollectionModal"
      @cancel="showCreateCollectionModal = false"
      @create="promptCreateCollection"
    />

    <!-- Delete Collection Error Modal -->
    <DeleteCollectionErrorModal
      :isVisible="showDeleteCollectionErrorModal"
      @closeModal="showDeleteCollectionErrorModal = false"
    >
      <template #description>
        <div>
          This collection contains
          <span
            v-if="
              ['audios', 'images', 'videos'].includes(deleteCollectionErrorCode)
            "
            >{{ deleteCollectionErrorCode }}
          </span>
          <span v-else> media </span>. If you wish to delete this collection,
          kindly
          <span v-if="deleteCollectionErrorCode === 'videos'">
            remove all the media individually or</span
          >
          use this
          <a
            class="vdb-c-underline"
            href="https://colab.research.google.com/github/video-db/videodb-cookbook/blob/main/guides/Cleanup.ipynb"
            target="_blank"
          >
            notebook</a
          >
          to cleanup the media first.
        </div>
      </template>
    </DeleteCollectionErrorModal>

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
import { computed, nextTick, onUnmounted, provide, ref, watch } from "vue";

import { useChatInterface } from "../hooks/useChatInterface";
import { useVideoDBAgent } from "../hooks/useVideoDBAgent";

import ChatInput from "./ChatInput.vue";
import ChatMessageContainer from "./ChatMessageContainer.vue";
import CollectionView from "./CollectionView.vue";
import DefaultScreen from "./elements/DefaultScreen.vue";
import NotificationCenter from "./elements/NotificationCenter.vue";
import SetupScreen from "./elements/SetupScreen.vue";
import Sidebar from "./elements/Sidebar.vue";
import UploadNotifications from "./elements/UploadNotifications.vue";
import UploadVideoQueryCard from "./elements/UploadVideoQueryCard.vue";

import ConfirmModal from "../modals/ConfirmModal.vue";
import CreateCollectionModal from "../modals/CreateCollectionModal.vue";
import DeleteCollectionErrorModal from "../modals/DeleteCollectionErrorModal.vue";
import UploadModal from "../modals/UploadModal.vue";
import Header from "./elements/Header.vue";

import ChatSearchResults from "../message-handlers/ChatSearchResults.vue";
import ChatVideo from "../message-handlers/ChatVideo.vue";
import ChatVideos from "../message-handlers/ChatVideos.vue";
import ImageHandler from "../message-handlers/ImageHandler.vue";
import TextResponse from "../message-handlers/TextResponse.vue";

import MeetingRecorderCanvas from "../canvas-handlers/meeting-recorder/MeetingRecorderCanvas.vue";

import CheckIcon from "../icons/Check.vue";
import CollectionIcon from "../icons/Collection.vue";
import DeleteIcon from "../icons/Delete3.vue";
import DirectorIcon from "../icons/Director.vue";
import ExternalLink from "../icons/ExternalLink.vue";
import QueryIcon from "../icons/Query.vue";
import SearchIcon from "../icons/SearchIcon.vue";
import MeetingRecorder from "../message-handlers/MeetingRecorder.vue";

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
      enabled: true,
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
      enableVideoView: true,
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
  generateAudioUrl,
  uploadMedia,
  createCollection,
  deleteCollection,
  refetchCollectionVideos,
  activeCollectionAudios,
  activeAudioData,
  refetchCollectionAudios,
  activeCollectionImages,
  activeImageData,
  refetchCollectionImages,
  deleteVideo,
  deleteAudio,
  deleteImage,
  renameSession,
  saveMeetingContext,
  fetchMeetingContext,
} = useChatHook(props.chatHookConfig);

const {
  chatInput,
  chatAttachments,
  setChatInput,
  messageHandlers,
  registerMessageHandler,
  canvasHandlers,
  registerCanvasHandler,
  canvasState,
  openCanvas,
  closeCanvas,
  setShrinkChat,
} = useChatInterface();

// Watch chatAttachments for new uploads
watch(chatAttachments, async (newAttachments) => {
  for (const attachment of newAttachments) {
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
          attachment.url = generateUrlData.url;
          attachment.upload_status = "complete";
        } else {
          throw Error("Upload failed");
        }
      } catch (e) {
        console.log("something went wrong", e);
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
registerMessageHandler("meeting_recorder", MeetingRecorder);

registerCanvasHandler("meeting_recorder", MeetingRecorderCanvas);

const isStaticPage = ref(false);
const chatWindowRef = ref(null);
const headerRef = ref(null);
const headerHeight = ref(0);
const headerObserver = ref(null); // ResizeObserver
const showDeleteVideoDialog = ref(false);
const videoToDelete = ref(null);
const showDeleteAudioDialog = ref(false);
const audioToDelete = ref(null);
const showDeleteImageDialog = ref(false);
const imageToDelete = ref(null);
const showDeleteCollectionErrorModal = ref(false);
const deleteCollectionErrorCode = ref(null);

const isSetupComplete = computed(() => {
  return (
    typeof configStatus.value === "object" &&
    configStatus.value !== null &&
    Object.values(configStatus.value).every((value) => value === true)
  );
});

const isContentLoading = computed(() => {
  return !(
    Array.isArray(activeCollectionVideos.value) &&
    Array.isArray(activeCollectionImages.value) &&
    Array.isArray(activeCollectionAudios.value)
  );
});

const isFreshUser = computed(() => {
  if (
    collections.value &&
    activeCollectionVideos.value &&
    activeCollectionAudios.value &&
    activeCollectionImages.value
  ) {
    return (
      collections.value.length < 2 &&
      activeCollectionVideos.value.length < 1 &&
      activeCollectionAudios.value.length < 1 &&
      activeCollectionImages.value.length < 1
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

const isDefaultScreen = computed(
  () => Object.keys(conversations).length === 0 && !showCollectionView.value,
);

const isCollectionView = computed(
  () => Object.keys(conversations).length === 0 && showCollectionView.value,
);

const isScrolled = ref(false);

const handleScroll = () => {
  if (chatWindowRef.value) {
    isScrolled.value = chatWindowRef.value.scrollTop > 0;
  }
};

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

watch(
  headerRef,
  (val) => {
    if (val) {
      if (headerObserver.value) {
        headerObserver.value.disconnect();
      }
      headerObserver.value = new ResizeObserver((entries) => {
        for (let entry of entries) {
          headerHeight.value = entry.contentRect.height;
        }
      });
      headerObserver.value.observe(val);
    }
  },
  { immediate: true },
);

watch(
  headerHeight,
  (val) => {
    document.documentElement.style.setProperty("--header-height", `${val}px`);
  },
  { immediate: true },
);

const scrollToBottom = () => {
  const chatWindow = chatWindowRef.value;
  if (!chatWindow) return;
  nextTick(() => {
    chatWindow.scroll({
      top: chatWindow.scrollHeight,
      behavior: "smooth",
    });
  });
};

watch(chatLoading, (val) => {
  if (val) {
    scrollToBottom();
  }
});

// Auto-close canvas when session changes
watch(sessionId, () => {
  if (canvasState.show) {
    closeCanvas();
  }
});

// Auto-close canvas when conversations are cleared or become empty
watch(
  () => Object.keys(conversations).length,
  (newLength, oldLength) => {
    // Close canvas if conversations go from having items to being empty
    if (oldLength > 0 && newLength === 0 && canvasState.show) {
      closeCanvas();
    }
  },
);

// -- Header Click handlers --
const toggleSidebar = () => {
  sidebarRef.value.toggleSidebar();
};

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

const handleUpdateSessionName = async ({ sessionId: _sessionId, name }) => {
  try {
    await renameSession(_sessionId, name);
  } catch (error) {
    console.error("Error renaming session:", error?.message || error);
  }
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
      refetchCollectionAudios();
      refetchCollectionImages();
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

const promptDeleteAudio = (audio) => {
  audioToDelete.value = audio;
  showDeleteAudioDialog.value = true;
};

const promptDeleteImage = (image) => {
  imageToDelete.value = image;
  showDeleteImageDialog.value = true;
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

const confirmDeleteAudio = async () => {
  if (!audioToDelete.value) {
    console.error("No video to delete.");
    return;
  }

  showDeleteAudioDialog.value = false;

  const { collection_id, id } = audioToDelete.value;
  audioToDelete.value = null;

  try {
    await deleteAudio(collection_id, id);
    notificationCenterRef.value.addNotification("Audio deleted successfully.", {
      type: "error",
      icon: DeleteIcon,
    });
  } catch (error) {
    console.error(`Error deleting audio: ${error.message}`);
    notificationCenterRef.value.addNotification("Error deleting audio", {
      type: "error",
      icon: DeleteIcon,
    });
  }
};

const confirmDeleteImage = async () => {
  if (!imageToDelete.value) {
    console.error("No video to delete.");
    return;
  }

  showDeleteImageDialog.value = false;

  const { collection_id, id } = imageToDelete.value;
  imageToDelete.value = null;

  try {
    await deleteImage(collection_id, id);
    notificationCenterRef.value.addNotification("Image deleted successfully.", {
      type: "error",
      icon: DeleteIcon,
    });
  } catch (error) {
    console.error(`Error deleting image: ${error.message}`);
    notificationCenterRef.value.addNotification("Error deleting image", {
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
      if (error.message.includes("non-zero videos")) {
        deleteCollectionErrorCode.value = "videos";
      } else if (error.message.includes("non-zero audios")) {
        deleteCollectionErrorCode.value = "audios";
      } else if (error.message.includes("non-zero images")) {
        deleteCollectionErrorCode.value = "images";
      }
      showDeleteCollectionErrorModal.value = true;
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
      content.push({
        type: "image",
        image: {
          image_id: image.image_id,
          url: image.url,
        },
      });
    }
  }

  addMessage({
    content: content,
    agents: taggedAgent.value,
  });
  taggedAgent.value = [];
};

onUnmounted(() => {
  if (headerObserver.value) {
    headerObserver.value.disconnect();
  }
});

defineExpose({
  chatInput,
  chatAttachments,
  chatInputRef,
  conversations,
  messageHandlers,
  addMessage,
  loadSession,
  activeCollectionData,
  activeCollectionVideos,
  activeCollectionAudios,
  activeCollectionImages,
  createNewSession,
  setChatInput,
  registerMessageHandler,
  uploadMedia,
  isScrolled,
  canvasState,
  openCanvas,
  closeCanvas,
  setShrinkChat,
  saveMeetingContext,
  fetchMeetingContext,
});

provide("videodb-chat", {
  chatInput,
  chatAttachments,
  chatLoading,
  conversations,
  messageHandlers,
  addMessage,
  loadSession,
  activeCollectionData,
  activeCollectionVideos,
  activeCollectionAudios,
  activeCollectionImages,
  setChatInput,
  registerMessageHandler,
  uploadMedia,
  canvasHandlers,
  registerCanvasHandler,
  canvasState,
  openCanvas,
  closeCanvas,
  setShrinkChat,
  saveMeetingContext,
  fetchMeetingContext,
});
</script>

<style>
.header-shadow {
  box-shadow:
    0 12px 26px rgba(0, 0, 0, 0.06),
    0 47px 47px rgba(0, 0, 0, 0.05),
    0 105px 63px rgba(0, 0, 0, 0.03),
    0 186px 75px rgba(0, 0, 0, 0.01),
    0 291px 82px rgba(0, 0, 0, 0);
}

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

.last-conv-height {
  min-height: calc(100% - var(--header-height));
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

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
