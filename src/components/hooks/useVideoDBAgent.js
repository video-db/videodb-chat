import { reactive, toRefs, watch, computed } from "vue";
import io from "socket.io-client";

export function useVideoDBAgent(sessionId) {
  const session = reactive({
    isConnected: false,
    sessionId: sessionId,
  });
  const conversations = reactive({})

  const messageHandlers = reactive({})
  const registerMessageHandler = (agentName, handler) => {
    console.log("debug : registering message handler", agentName, handler)
    if (!messageHandlers[agentName]) {
      messageHandlers[agentName] = []
    }
    messageHandlers[agentName].push(handler)
  }

  const events = [
    "chat"
  ];

  watch(session, (val) => {
    console.log("debug : session updated", val)
  })

  watch(conversations, (val) => {
    console.log("debug : conversations updated", val)
  })

  const messageLoading = computed(() => {
    const elm = Object.values(conversations);
    const isLoading = elm.some((conv) => {
      const msgs = Object.values(conv);
      return msgs.some((content) => {
        return content.status === "progress" || content.clientLoading;
      });
    });
    return isLoading;
  });


  const socket = io("http://127.0.0.1:5000/chat");

  // #TODO, when connected to socket, get all messages first before sending new messages
  // const getAllMessages = async () => {
  //   console.log("getting all messages")
  //   const response = await fetch(`http://127.0.0.1:5000/session/${sessionId}`);
  //   const data = await response.json();
  //   session.messages= data;
  // }


  // #TODO: possible UX optimization, add loading state when sending message, checkout publishing@ChatInterface.vue/watch/sessionId
  const addMessage = (message) => {
    if (session.isConnected) {
      const convId = new Date().getTime()
      const msgId = new Date().getTime() + 1
      const loadingMsgId = new Date().getTime() + 2;
      const _message = {
        "conv_id": convId,
        "msg_id": msgId,
        "session_id": session.sessionId,
        "type": 'input',
        "sender": 'user',
        ...message
      }

      // #TODO: find a better way to signal that this loading state is added by client for a UX improvement
      // Add a temporary loading message to the conversation
      const _loadingMessage = {
        "conv_id": convId,
        "msg_id": loadingMsgId,
        "session_id": session.sessionId,
        "type": 'output',
        "sender": 'assistant',
        "clientLoading": true
      }

      if (!conversations[convId]) {
        conversations[convId] = {};
      }
      conversations[convId][msgId] = _message
      socket.emit("chat", _message);
      conversations[convId][loadingMsgId] = _loadingMessage
    }
    // #TODO: Add message to buffer
  };


  const bindEvents = (events, emit) => {
    if (socket) {
      events.forEach((customEvent) => {
        (function () {
          socket.on(customEvent, (event) => {
            console.log("debug :videodb-chat triggered", customEvent, event);
            switch (customEvent) {
              case "connect":
                session.isConnected = true
                break
              case "chat":
                if (!conversations[event.conv_id]) {
                  conversations[event.conv_id] = {};
                }
                const _event = { "sender": "assistant", ...event }
                conversations[event.conv_id][event.msg_id] = _event
                
                // Remove the client-side loading message if it exists
                const clientLoadingMessage = Object.values(conversations[event.conv_id]).find(msg => msg.clientLoading === true);
                if (clientLoadingMessage) {
                  delete conversations[event.conv_id][clientLoadingMessage.msg_id];
                }
                break
              default:
                emit(customEvent, { event });
            }
          });
        })();
      });
    }
  };


  return {
    ...toRefs(session),
    events,
    conversations,
    messageLoading,
    // getAllMessages,
    messageHandlers,
    registerMessageHandler,
    addMessage,
    bindEvents,
  };
}
