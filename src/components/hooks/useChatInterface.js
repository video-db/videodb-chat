import { ref, reactive } from "vue";

export function useChatInterface() {
  const messageHandlers = {};
  const chatInput = ref("");
  const chatAttachments = reactive([]);

  // Right-side canvas state and registry
  const canvasHandlers = {};
  const canvasState = reactive({
    show: false,
    shrinkChat: false,
    type: null,
    content: null,
  });

  const registerMessageHandler = (contentType, handler) => {
    messageHandlers[contentType] = handler;
  };

  const registerCanvasHandler = (canvasType, handler) => {
    canvasHandlers[canvasType] = handler;
  };

  const setChatInput = (input) => {
    chatInput.value = input;
  };

  const setShrinkChat = (shrink) => {
    canvasState.shrinkChat = shrink;
  };

  const openCanvas = (type, content) => {
    canvasState.show = true;
    canvasState.type = type;
    canvasState.content = content || null;
  };

  const closeCanvas = () => {
    canvasState.show = false;
    canvasState.type = null;
    canvasState.content = null;
    canvasState.shrinkChat = false;
  };

  return {
    chatInput,
    chatAttachments,
    setChatInput,
    setShrinkChat,
    messageHandlers,
    registerMessageHandler,
    canvasHandlers,
    registerCanvasHandler,
    canvasState,
    openCanvas,
    closeCanvas,
  };
}
