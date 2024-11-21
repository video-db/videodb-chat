<template>
  <div
    v-if="!isSystem"
    :class="[
      'vdb-c-flex vdb-c-h-auto vdb-c-w-full vdb-c-justify-start vdb-c-py-14',
      {
        'vdb-c-border-b vdb-c-border-kilvish-300 vdb-c-bg-white': isUser,
      },
    ]"
  >
    <div class="message-width">
      <div
        v-if="isUser"
        class="vdb-c-w-full vdb-c-transform vdb-c-transition-all"
      >
        <text-response
          :content="message.content[0]"
          :is-user="true"
          :conv-id="message.conv_id"
          :msg-id="message.msg_id"
        />
      </div>

      <div v-else-if="isAssistant">
        <div class="vdb-c-flex vdb-c-flex-col vdb-c-gap-8">
          <div class="vdb-c-py-14">
            <ChatMessageSteps
              :steps="message.actions"
              :status="finalStatus"
              :expanded="isLastConv && message.status !== 'success'"
            />
          </div>

          <div v-for="content in message.content">
            <component
              v-if="Object.keys(messageHandlers).includes(content.type)"
              :is="messageHandlers[content.type]"
              :is-last-conv="isLastConv"
              :content="content"
              :is-user="isUser"
              :search-term="searchTerm"
              :conv-id="message.conv_id"
              :msg-id="message.msg_id"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import TextResponse from "../message-handlers/TextResponse.vue";
import ChatMessageSteps from "./elements/ChatMessageSteps.vue";

import { useVideoDBChat } from "../../context.js";

const props = defineProps({
  message: {
    type: Object,
    default: () => ({}),
  },
  isStaticPage: {
    type: Boolean,
    default: false,
  },
  isLastConv: {
    type: Boolean,
    default: false,
  },
  messageList: {
    type: Array,
    required: true,
  },
  currentIndex: {
    type: Number,
    required: true,
  },
  messageLoading: {
    type: Boolean,
    default: false,
  },
  searchTerm: {
    type: String,
    default: "",
  },
  isLastConv: {
    type: Boolean,
    default: false,
  },
});

const { messageHandlers } = useVideoDBChat();

const isUser = computed(() => props.message.msg_type === "input");
const isAssistant = computed(() => props.message.msg_type === "output");
const isSystem = computed(() => props.message.msg_type === "system");

const finalStatus = computed(() => {
  if (props.message.status === "error") {
    return "error";
  }
  const assistantContent = props.message?.content?.find(
    (c) => c.agent_name === "assistant",
  );
  return assistantContent?.status || props.message.status;
});
</script>

<style>
.message-width {
  width: 100%;
  max-width: 100%;
}

@media (min-width: 768px) {
  .message-width {
    width: 98%;
    max-width: 98%;
  }
}
</style>
