import { reactive, toRefs, watch, computed } from "vue";
import io from "socket.io-client";

export function useVideoDBAgent(config) {
  const { debug = false, url, sessionId, videoId = null, collectionId = null } = config;
  if (debug) console.log("debug :videodb-chat config", config);
  const socket = io(url);

  const session = reactive({
    isConnected: false,
    sessionId,
    videoId,
    collectionId
  });
  const conversations = reactive({});
  const bufferMessages = reactive([]);

  watch(() => session.isConnected, (val) => {
    if (debug) console.log("debug :videodb-chat session.isConnected :", val);
  });

  watch(() => conversations, (val) => {
    if (debug) console.log("debug :videodb-chat conversations updated:", val);
  }, { deep: true });

  const addClientLoadingMessage = (convId) => {
    const messages = Object.values(conversations[convId]);
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.clientLoading) {
      const loadingMsgId = Date.now() + 2;
      conversations[convId][loadingMsgId] = {
        conv_id: convId,
        msg_id: loadingMsgId,
        session_id: session.sessionId,
        type: 'output',
        sender: 'assistant',
        clientLoading: true
      };
    }
  };

  const removeClientLoadingMessage = (convId) => {
    const clientLoadingMessage = Object.values(conversations[convId]).find(msg => msg.clientLoading);
    if (clientLoadingMessage) {
      delete conversations[convId][clientLoadingMessage.msg_id];
    }
  };

  const addMessage = (message) => {
    if (session.isConnected) {
      const convId = Date.now();
      const msgId = convId + 1;
      const _message = {
        type: 'input',
        sender: 'user',
        conv_id: convId,
        msg_id: msgId,
        session_id: session.sessionId,
        collection_id: session.collectionId,
        video_id: session.videoId,
        ...message
      };

      conversations[convId] = { [msgId]: _message };
      socket.emit("chat", _message);
      addClientLoadingMessage(convId);
    } else {
      bufferMessages.push(message);
    }
  };

  socket.on("connect", () => {
    if (debug) console.log("debug :videodb-chat socket emmited connect");
    session.isConnected = true;
    bufferMessages.forEach(addMessage);
  });

  socket.on("chat", (event) => {
    if (debug) console.log("debug :videodb-chat socket emmited chat", event);
    if (session.isConnected) {
      const { conv_id: convId, msg_id: msgId } = event;
      if (!conversations[convId]) {
        conversations[convId] = {};
      }
      conversations[convId][msgId] = { sender: "assistant", ...event };
      removeClientLoadingMessage(convId);
    }
  });

  const chatLoading = computed(() => 
    Object.values(conversations).some(conv => 
      Object.values(conv).some(content => 
        content.status === "progress" || content.clientLoading
      )
    )
  );

  const bindEvents = (events, emit) => {
    events.forEach(customEvent => {
      socket.on(customEvent, (event) => {
        if (debug) console.log("debug :videodb-chat triggered", customEvent, event);
        emit(customEvent, { event });
      });
    });
  };

  return {
    ...toRefs(session),
    conversations,
    chatLoading,
    addMessage,
    bindEvents,
  };
}
