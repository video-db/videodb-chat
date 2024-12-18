import type { App } from "vue";
import ChatInterface from "./components/chat/ChatInterface.vue";
import DefaultScreen from "./components/chat/elements/DefaultScreen.vue";
import ChatMessageContainer from "./components/chat/ChatMessageContainer.vue";
import Sidebar from "./components/chat/elements/Sidebar.vue";
import { useChatInterface } from "./components/hooks/useChatInterface";
import { useVideoDBChat } from "./context";
import ChatSearchResults from "./components/message-handlers/ChatSearchResults.vue";
import ChatVideo from "./components/message-handlers/ChatVideo.vue";
import ChatVideos from "./components/message-handlers/ChatVideos.vue";
import ImageHandler from "./components/message-handlers/ImageHandler.vue";
import TextResponse from "./components/message-handlers/TextResponse.vue";
import "./style.css";

function install(app: App) {
  app.component("ChatInterface", ChatInterface);
}

export {
  ChatInterface,
  DefaultScreen,
  ChatMessageContainer,
  Sidebar,
  ChatSearchResults,
  ChatVideo,
  ChatVideos,
  ImageHandler,
  TextResponse,
  useVideoDBChat,
  useChatInterface,
  install,
};
