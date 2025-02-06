import { ref, reactive } from "vue";

export function useChatInterface() {
  const messageHandlers = {};
  const chatInput = ref("");
  const chatAttachments = reactive([])

  const registerMessageHandler = (contentType, handler) => {
    messageHandlers[contentType] = handler;
  };

  const setChatInput = (input) => {
    chatInput.value = input;
  };

  return {
    chatInput,
    chatAttachments,
    setChatInput,
    messageHandlers,
    registerMessageHandler,
  };
}
