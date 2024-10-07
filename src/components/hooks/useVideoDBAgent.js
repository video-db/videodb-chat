import { reactive, toRefs, watch, computed } from "vue";
import io from "socket.io-client";

// #TODO: add config for custom route for fetching sessions and collections
export function useVideoDBAgent(config) {
  const { debug = false, socketUrl, httpUrl } = config;
  if (debug) console.log("debug :videodb-chat config", config);
  const socket = io(socketUrl);

  const session = reactive({
    isConnected: false,
    sessionId: null,
    videoId: null,
    collectionId: null,
  });
  const conversations = reactive({});
  const bufferMessages = reactive([]);

  const setCollectionId = (collectionId) => {
    session.collectionId = collectionId;
  };

  const setVideoId = (videoId) => {
    session.videoId = videoId;
  };

  watch(
    () => session.isConnected,
    (val) => {
      if (debug) console.log("debug :videodb-chat session.isConnected :", val);
    },
  );

  watch(
    () => conversations,
    (val) => {
      if (debug) console.log("debug :videodb-chat conversations updated:", val);
    },
    { deep: true },
  );

  const loadSession = (sessionId, fetchPastMessages = false) => {
    session.sessionId = sessionId;
    if (!fetchPastMessages) {
      Object.keys(conversations).forEach((key) => delete conversations[key]);
    } else {
      fetchSession(sessionId).then((res) => {
        if (debug) console.log("debug :videodb-chat session loaded", res);
        if (res.status === "success") {
          session.videoId = res.data.video_id || null;
          session.collectionId =
            res.data.collection_id || session.collectionId || null;
          Object.keys(conversations).forEach(
            (key) => delete conversations[key],
          );
          // Populate conversations with fetched data
          if (res.data.conversation) {
            res.data.conversation.forEach((message) => {
              const { conv_id, msg_id } = message;
              if (!conversations[conv_id]) {
                conversations[conv_id] = {};
              }
              conversations[String(conv_id)][String(msg_id)] = {
                sender: message.msg_type === "input" ? "user" : "assistant",
                ...message,
              };
            });
          }
        }
      });
    }
  };

  const addClientLoadingMessage = (convId) => {
    const messages = Object.values(conversations[convId]);
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.clientLoading) {
      const loadingMsgId = Date.now() + 2;
      conversations[convId][loadingMsgId] = {
        conv_id: String(convId),
        msg_id: String(loadingMsgId),
        session_id: String(session.sessionId),
        type: "output",
        sender: "assistant",
        clientLoading: true,
      };
    }
  };

  const removeClientLoadingMessage = (convId) => {
    const clientLoadingMessage = Object.values(conversations[convId]).find(
      (msg) => msg.clientLoading,
    );
    if (clientLoadingMessage) {
      delete conversations[convId][clientLoadingMessage.msg_id];
    }
  };

  const addMessage = (message) => {
    console.log("debug :videodb-chat addMessage", message);
    if (session.isConnected) {
      const convId = Date.now();
      const msgId = convId + 1;
      const _message = {
        agent_name: null,
        msg_type: "input",
        sender: "user",
        conv_id: String(convId),
        msg_id: String(msgId),
        session_id: String(session.sessionId),
        collection_id: session.collectionId
          ? String(session.collectionId)
          : null,
        video_id: session.videoId ? String(session.videoId) : null,
        ...message,
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
    // #TODO: this is a backend bug, session_id is received as null
    // if (session.sessionId !== event.session_id) return;
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
    Object.values(conversations).some((conv) =>
      Object.values(conv).some(
        (content) => content.status === "progress" || content.clientLoading,
      ),
    ),
  );



  const fetchSession = async (sessionId) => {
    const res = {};
    try {
      const response = await fetch(`${httpUrl}/session/${sessionId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      res.status = "success";
      res.data = data;
    } catch (error) {
      res.status = "error";
      res.error = error;
    }
    return res;
  };

  const fetchSessions = async () => {
    const res = {};
    try {
      const response = await fetch(`${httpUrl}/session`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      res.status = "success";
      res.data = data;
    } catch (error) {
      res.status = "error";
      res.error = error;
    }
    return res;
  };

  const fetchCollections = async () => {
    const res = {};
    try {
      const response = await fetch(`${httpUrl}/videodb/collection`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      res.status = "success";
      res.data = data;
    } catch (error) {
      res.status = "error";
      res.error = error;
    }
    return res;
  };

  // #TODO: figure out how to give user full control over endpoint configuration
  const fetchCollection = async (collectionId) => {
    const res = {};
    try {
      const response = await fetch(
        `${httpUrl}/videodb/collection/${collectionId}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      res.status = "success";
      res.data = data;
    } catch (error) {
      res.status = "error";
      res.error = error;
    }
    return res;
  };

  const fetchCollectionVideo = async (collectionId, videoId) => {
    const res = {};
    try {
      const response = await fetch(
        `${httpUrl}/videodb/collection/${collectionId}/video/${videoId}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      res.status = "success";
      res.data = data;
    } catch (error) {
      res.status = "error";
      res.error = error;
    }
    return res;
  };

  const fetchCollectionVideos = async (collectionId) => {
    const res = {};
    try {
      const response = await fetch(
        `${httpUrl}/videodb/collection/${collectionId}/video`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      res.status = "success";
      res.data = data;
    } catch (error) {
      res.status = "error";
      res.error = error;
    }
    return res;
  };

  const bindEvents = (events, emit) => {
    events.forEach((customEvent) => {
      socket.on(customEvent, (event) => {
        if (debug)
          console.log("debug :videodb-chat triggered", customEvent, event);
        emit(customEvent, { event });
      });
    });
  };

  return {
    ...toRefs(session),
    chatLoading,
    conversations,
    setVideoId,
    addMessage,
    bindEvents,
    loadSession,
    setCollectionId,
    fetchSession,
    fetchSessions,
    fetchCollection,
    fetchCollections,
    fetchCollectionVideo,
    fetchCollectionVideos,
  };
}
