import { onBeforeMount, ref, reactive, toRefs, watch, computed } from "vue";
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
    collectionId: "default",
  });

  const fetchData = async (endpoint) => {
    const res = {};
    try {
      const response = await fetch(`${httpUrl}${endpoint}`);
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

  const allCollections = ref([]);
  const allSessionsRaw = ref([]);
  const allSessions = computed(() => {
    return [...allSessionsRaw.value].sort(
      (a, b) => b.created_at - a.created_at,
    );
  });
  const allAgents = ref([]);

  const conversations = reactive({});
  const activeCollectionData = ref(null);
  const activeCollectionVideos = ref(null);
  const activeVideoData = ref(null);

  const setCollectionId = (collectionId) => {
    session.collectionId = collectionId;
  };

  const setVideoId = (videoId) => {
    session.videoId = videoId;
  };

  const fetchSession = async (sessionId) => fetchData(`/session/${sessionId}`);
  const fetchSessions = async () => fetchData("/session");
  const fetchCollections = async () => fetchData("/videodb/collection");
  const fetchCollection = async (collectionId) =>
    fetchData(`/videodb/collection/${collectionId}`);
  const fetchCollectionVideo = async (collectionId, videoId) =>
    fetchData(`/videodb/collection/${collectionId}/video/${videoId}`);
  const fetchCollectionVideos = async (collectionId) =>
    fetchData(`/videodb/collection/${collectionId}/video`);
  const fetchAllAgents = async () => fetchData("/agent");

  onBeforeMount(() => {
    fetchCollections().then((res) => {
      allCollections.value = res.data;
    });
    fetchSessions().then((res) => {
      allSessionsRaw.value = res.data;
    });
    fetchAllAgents().then((res) => {
      allAgents.value = res.data;
    });
  });

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

  watch(
    () => session.collectionId,
    (val) => {
      activeCollectionData.value = null;
      activeCollectionVideos.value = null;
      if (val) {
        const collection = allCollections.value.find((c) => c.id === val);
        if (collection) {
          activeCollectionData.value = collection;
        } else {
          fetchCollection(val).then((res) => {
            activeCollectionData.value = res.data;
          });
        }
        fetchCollectionVideos(val).then((res) => {
          activeCollectionVideos.value = res.data;
        });
      }
    },
    { immediate: true },
  );

  watch(
    () => session.videoId,
    (val) => {
      activeVideoData.value = null;
      if (val) {
        fetchCollectionVideo(session.collectionId, val).then((res) => {
          activeVideoData.value = res.data;
        });
      }
    },
    { immediate: true },
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
        msg_type: "output",
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
      if (
        !allSessionsRaw.value.some((s) => s.session_id === session.sessionId)
      ) {
        allSessionsRaw.value.push({
          session_id: session.sessionId,
          created_at: Date.now() / 1000,
        });
      }
      const convId = Date.now();
      const msgId = convId + 1;
      const _message = {
        agents: [],
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
    }
  };

  socket.on("connect", () => {
    if (debug) console.log("debug :videodb-chat socket emmited connect");
    session.isConnected = true;
  });

  socket.on("chat", (event) => {
    if (debug) console.log("debug :videodb-chat socket emmited chat", event);
    if (session.sessionId !== event.session_id) return;
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

  return {
    ...toRefs(session),
    allCollections,
    allSessions,
    allAgents,
    activeCollectionData,
    activeCollectionVideos,
    activeVideoData,
    chatLoading,
    conversations,
    setVideoId,
    addMessage,
    loadSession,
    setCollectionId,
  };
}
