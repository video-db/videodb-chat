<template>
  <section
    :class="{
      'vdb-c-fixed': size === 'full',
    }"
    class="vdb-c-inset-0 vdb-c-z-50 vdb-c-flex vdb-c-h-full vdb-c-w-full vdb-c-flex-col vdb-c-items-center vdb-c-justify-center vdb-c-overflow-y-hidden vdb-c-bg-black-64 vdb-c-text-textdark md:vdb-c-p-20 md:vdb-c-pl-40"
  >
    <div
      class="vdb-c-z-10 vdb-c-flex vdb-c-h-auto vdb-c-w-full vdb-c-justify-between vdb-c-bg-kilvish-300 vdb-c-px-10 vdb-c-py-6 md:vdb-c-hidden md:vdb-c-bg-transparent md:vdb-c-px-0 md:vdb-c-py-0"
    >
      <button
        class="vdb-c-flex vdb-c-items-center vdb-c-rounded-24 vdb-c-bg-white vdb-c-p-8 vdb-c-pr-12 focus:vdb-c-bg-kilvish-100 md:vdb-c-hidden"
        @click="$emit('backBtnClick')"
      >
        <chat-chevron-left class-name="vdb-c-w-16 vdb-c-h-16 vdb-c-mr-8" />
        <span class="vdb-c-text-xs vdb-c-font-medium">Back</span>
      </button>
      <red-share-button
        v-show="showShareButton"
        base-class="md:vdb-c-hidden vdb-c-rounded-24 vdb-c-rsb"
        :text-to-copy="shareUrl"
        success-message="Copied Link"
        initial-message="Share Chat"
      />
    </div>
    <div
      class="vdb-c-relative vdb-c-h-full vdb-c-w-full vdb-c-bg-white vdb-c-p-10 vdb-c-shadow-2 md:vdb-c-w-11/12 md:vdb-c-rounded-20"
    >
      <div
        class="vdb-c-chat-parent vdb-c-relative vdb-c-overflow-hidden vdb-c-rounded-t-20 vdb-c-bg-superman-200"
      >
        <section
          ref="chatWindow"
          class="vdb-c-absolute vdb-c-left-0 vdb-c-top-0 vdb-c-flex vdb-c-h-full vdb-c-max-h-full vdb-c-w-full vdb-c-flex-col vdb-c-overflow-x-auto vdb-c-overflow-y-auto"
        >
          <!-- Empty Container; if no messages are there-->
          <div
            class="vdb-c-flex vdb-c-w-full vdb-c-transform vdb-c-flex-col vdb-c-items-center vdb-c-justify-center vdb-c-transition-all vdb-c-duration-500"
            :class="{
              'vdb-c-h-full vdb-c-opacity-100': showEmptyContainer,
              'vdb-c-h-0 vdb-c-opacity-0': !showEmptyContainer,
            }"
          >
            <div
              class="vdb-c-mb-30 vdb-c-flex vdb-c-items-center vdb-c-justify-center vdb-c-rounded-20 vdb-c-bg-white vdb-c-p-20"
            >
              <component
                :is="emptyContainerLogo"
                v-if="typeof emptyContainerLogo === 'object'"
              />
              <img
                :src="emptyContainerLogo"
                v-else-if="typeof emptyContainerLogo === 'string'"
                alt="Logo"
              />
            </div>
            <div
              class="vdb-c-absolute vdb-c-bottom-0 vdb-c-left-0 vdb-c-right-0"
            >
              <follow-up-container
                :follow-up-prompts="searchSuggestions"
                :is-empty="showEmptyContainer"
                @followUpClicked="handleFollowUp"
              />
            </div>
          </div>

          <!-- Message Container -->
          <chat-message-container
            v-for="(key, i) in Object.keys(conversations)"
            :key="key"
            :conversation="conversations[key]"
            :user-image="userImage"
            :assistant-image="assistantImage"
            :search-term="searchTerm"
            :is-static-page="isStaticPage"
            :is-last-conv="i === Object.keys(conversations).length - 1"
          />
        </section>
      </div>

      <!-- chat input -->
      <div
        class="vdb-c-chat-input-container vdb-c-relative vdb-c-rounded-b-20 vdb-c-border vdb-c-border-kilvish-300 vdb-c-bg-white vdb-c-shadow-minimal-up"
      >
        <chat-input
          :input-disabled="chatLoading"
          :placeholder="chatInputPlaceholder"
          @onChange="searchTerm = $event"
          @onSubmit="addMessage({ content: $event })"
        />
      </div>

      <!-- Share & Back buttons -->
      <div
        class="vdb-c-absolute vdb-c--right-46 vdb-c-top-20 vdb-c-hidden vdb-c-w-56 vdb-c-flex-col vdb-c-gap-18 vdb-c-rounded-r-16 vdb-c-bg-white vdb-c-px-8 vdb-c-py-20 md:vdb-c-flex"
      >
        <button
          class="vdb-c-flex vdb-c-h-40 vdb-c-w-40 vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-bg-white hover:vdb-c-bg-kilvish-400"
          @click="emit('backBtnClick')"
        >
          <chat-chevron-left class-name="vdb-c-w-28 vdb-c-h-28" />
        </button>
        <share-button v-show="showShareButton" :value="shareUrl" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, provide, nextTick } from "vue";
import { v4 as uuidv4 } from "uuid";

import { useVideoDBAgent } from "../hooks/useVideoDBAgent";
import { useChatInterface } from "../hooks/useChatInterface";

import ChatInput from "./ChatInput.vue";

import ChatMessageContainer from "./ChatMessageContainer.vue";

import FollowUpContainer from "./elements/FollowUpContainer.vue";

import ChatSearchResults from "../message-handlers/ChatSearchResults.vue";
import ChatVideo from "../message-handlers/ChatVideo.vue";

import RedShareButton from "../buttons/RedShareButton.vue";
import ShareButton from "../buttons/ShareButton.vue";

import ChatChevronLeft from "../icons/ChatChevronLeft.vue";
import ChatUser from "../icons/ChatUser.vue";
import AssistantIcon from "../icons/AssistantIcon.vue";
import SpextLogoBlue from "../icons/SpextLogoBlue.vue";

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
      url: "http://127.0.0.1:5000/chat",
      sessionId: uuidv4(),
      collectionId: null,
      videoId: null,
      debug: false,
    }),
  },
  size: {
    type: String,
    default: "full",
    validator: (value) => ["full", "embedded"].includes(value),
  },
});

const useChatHook = props.customChatHook || useVideoDBAgent;
const { addMessage, conversations, chatLoading } = useChatHook(
  props.chatHookConfig,
);

const { messageHandlers, registerMessageHandler } = useChatInterface();

if (!props.customChatHook) {
  registerMessageHandler("search", ChatSearchResults);
  registerMessageHandler("search", ChatVideo);
}

const isStaticPage = ref(false);
const chatWindow = ref(null);
const searchTerm = ref("");

const showEmptyContainer = computed(
  () => Object.keys(conversations).length === 0,
);

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

const showShareButton = computed(
  () => Object.keys(conversations).length && props.shareUrl,
);

const emit = defineEmits(["backBtnClick"]);

const handleFollowUp = (val) => {
  if (val.text) {
    addMessage({ content: val.text });
  }
};

defineExpose({
  conversations,
  chatLoading,
  messageHandlers,
  registerMessageHandler,
  addMessage,
});

provide("videodb-chat", {
  conversations,
  chatLoading,
  messageHandlers,
  registerMessageHandler,
  addMessage,
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
