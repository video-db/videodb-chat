import { onBeforeMount, ref, reactive, toRefs, watch, computed } from "vue";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const fetchData = async (rootUrl, endpoint) => {
  const res = {};
  try {
    const response = await fetch(`${rootUrl}${endpoint}`);
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
  const configStatus = ref(null);

  const collections = ref([]);
  const sessions = ref([]);
  const sessionsSorted = computed(() => {
    return [...sessions.value].sort((a, b) => b.created_at - a.created_at);
  });
  const agents = ref([]);

  const conversations = reactive({});
  const activeCollectionData = ref(null);
  const activeCollectionVideos = ref(null);
  const activeVideoData = ref(null);

  const fetchSession = async (sessionId) =>
    fetchData(httpUrl, `/session/${sessionId}`);
  const fetchSessions = async () => fetchData(httpUrl, "/session");
  const fetchCollections = async () =>
    fetchData(httpUrl, "/videodb/collection");
  const fetchCollection = async (collectionId) =>
    fetchData(httpUrl, `/videodb/collection/${collectionId}`);
  const fetchCollectionVideo = async (collectionId, videoId) =>
    fetchData(httpUrl, `/videodb/collection/${collectionId}/video/${videoId}`);
  const fetchCollectionVideos = async (collectionId) =>
    fetchData(httpUrl, `/videodb/collection/${collectionId}/video`);
  const fetchAllAgents = async () => fetchData(httpUrl, "/agent");
  const fetchConfigStatus = async () => fetchData(httpUrl, "/config/check");

  const uploadMedia = async (uploadData) => {
    const { source, sourceType, collectionId } = uploadData;
    if (sourceType === "file") {
      const formData = new FormData();
      formData.append("file", source);

      return fetch(`${httpUrl}/videodb/collection/${collectionId}/upload`, {
        method: "POST",
        body: formData,
      });
    } else if (sourceType === "url") {
      return fetch(`${httpUrl}/videodb/collection/${collectionId}/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source: source.url, source_type: sourceType }),
      });
    }
  };

  const generateImageUrl = async (collectionId, imageId) => {
    const res = {};
    try {
      const response = await fetch(
        `${httpUrl}/videodb/collection/${collectionId}/image/${imageId}/generate_url`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const url = await response.text();
      res.status = "success";
      res.url = url;
    } catch (error) {
      res.status = "error";
      res.error = error;
    }
    return res;
  };

  const refetchCollectionVideos = async () => {
    fetchCollectionVideos(session.collectionId).then((res) => {
      activeCollectionVideos.value = res.data;
    });
  };

  onBeforeMount(() => {
    fetchConfigStatus().then((res) => {
      if (debug) console.log("debug :videodb-chat config status", res);
      configStatus.value = res.data;
    });
  });

  watch(configStatus, (val) => {
    if (
      typeof val === "object" &&
      val !== null &&
      Object.values(val).every((value) => value === true)
    ) {
      Promise.all([
        fetchCollections().then((res) => {
          const defaultCollection = res.data[0];
          defaultCollection.name = "VideoDB Default Collection";
          activeCollectionData.value = defaultCollection;
          collections.value = [defaultCollection, ...res.data.slice(1)];
        }),
        fetchCollectionVideos(session.collectionId).then((res) => {
          activeCollectionVideos.value = res.data;
        }),
      ]);
      fetchSessions().then((res) => {
        sessions.value = res.data;
      });
      fetchAllAgents().then((res) => {
        agents.value = res.data;
      });
    }
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
      if (debug)
        console.log(
          "debug :videodb-chat conversations updated:",
          JSON.parse(JSON.stringify(val)),
        );
    },
    { deep: true },
  );

  watch(
    () => session.collectionId,
    (val) => {
      const fetchedForSession = session.sessionId;
      activeCollectionData.value = null;
      activeCollectionVideos.value = null;
      if (val) {
        const collection = collections.value.find((c) => c.id === val);
        if (collection) {
          activeCollectionData.value = collection;
        } else {
          fetchCollection(val).then((res) => {
            if (session.sessionId !== fetchedForSession) return;
            activeCollectionData.value = res.data;
          });
        }
        fetchCollectionVideos(val).then((res) => {
          if (session.sessionId !== fetchedForSession) return;
          activeCollectionVideos.value = res.data;
        });
      }
    },
  );

  watch(
    () => session.videoId,
    (val) => {
      const fetchedForSession = session.sessionId;
      activeVideoData.value = null;
      if (val) {
        fetchCollectionVideo(session.collectionId, val).then((res) => {
          if (session.sessionId !== fetchedForSession) return;
          activeVideoData.value = res.data;
        });
      }
    },
  );

  const loadSession = (sessionId) => {
    let fetchPastMessages = true;
    if (!sessionId) {
      sessionId = uuidv4();
      fetchPastMessages = false;
    }
    if (debug) console.log("debug :videodb-chat session loading", sessionId);
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

  const deleteSession = (sessionId) => {
    fetch(`${httpUrl}/session/${sessionId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((res) => {
        if (debug) console.log("debug :videodb-chat session deleted", res);
        sessions.value = sessions.value.filter(
          (s) => s.session_id !== sessionId,
        );
      })
      .catch((error) => {
        if (debug)
          console.error("debug :videodb-chat error deleting session", error);
      });
  };

  const createCollection = async (name, description) => {
    if (!name || name.trim() === "") {
      throw new Error("Collection name is required.");
    }

    try {
      const response = await fetch(`${httpUrl}/videodb/collection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      let res;
      try {
        res = await response.json();
      } catch (jsonError) {
        throw new Error("Failed to parse server response.");
      }

      if (Array.isArray(collections.value)) {
        collections.value.push(res.data.collection);
      }

      return res.data.collection;
    } catch (error) {
      console.error("Error creating collection:", error);
      throw new Error(
        "An unexpected error occurred while creating the collection.",
      );
    }
  };

  const deleteCollection = async (collectionId) => {
    if (!collectionId) {
      throw new Error("Collection ID is required.");
    }

    try {
      const response = await fetch(
        `${httpUrl}/videodb/collection/${collectionId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete the collection.");
      }

      if (Array.isArray(collections.value)) {
        collections.value = collections.value.filter(
          (c) => c.id !== collectionId,
        );
      }

      if (session.collectionId === collectionId) {
        session.collectionId =
          collections.value.length > 0 ? collections.value[0].id : null;
      }

      return data;
    } catch (error) {
      if (
        error.message.includes("Invalid request: Your collection has non-zero")
      ) {
        throw error;
      }

      console.error("Unexpected error deleting collection:", error);
      throw error;
    }
  };

  const deleteVideo = async (collectionId, videoId) => {
    if (!collectionId || !videoId) {
      throw new Error("Collection ID and Video ID are required.");
    }

    try {
      const response = await fetch(
        `${httpUrl}/videodb/collection/${collectionId}/video/${videoId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete the video.");
      }
      const collection = collections.value.find(
        (col) => col.id === collectionId,
      );

      if (collection && Array.isArray(activeCollectionVideos.value)) {
        activeCollectionVideos.value = activeCollectionVideos.value.filter(
          (video) => video.id !== videoId,
        );
      }
      return data;
    } catch (error) {
      console.error(`Failed to delete video ${videoId}:`, error);
      throw error;
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
    if (debug) console.log("debug :videodb-chat addMessage", message);
    if (session.isConnected) {
      if (!sessions.value.some((s) => s.session_id === session.sessionId)) {
        sessions.value.push({
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

  return {
    ...toRefs(session),
    configStatus,
    collections,
    sessions: sessionsSorted,
    agents,
    activeCollectionData,
    activeCollectionVideos,
    activeVideoData,
    conversations,
    addMessage,
    loadSession,
    deleteSession,
    createCollection,
    deleteCollection,
    deleteVideo,
    uploadMedia,
    generateImageUrl,
    refetchCollectionVideos,
  };
}
