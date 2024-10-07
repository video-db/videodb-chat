import { ref, reactive } from "vue";

export function useChatInterface() {
  const messageHandlers = {};
  const chatInput = ref("");

  const registerMessageHandler = (contentType, handler) => {
    messageHandlers[contentType] = handler;
  };

  const setChatInput = (input) => {
    chatInput.value = input;
  };

  return {
    chatInput,
    setChatInput,
    messageHandlers,
    registerMessageHandler,
  };
}
