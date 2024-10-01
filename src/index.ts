import type { App } from "vue";
import ChatInterface from "./components/chat/ChatInterface.vue";
import { useChatInterface } from "./components/hooks/useChatInterface";
import "./style.css";

function install(app: App) {
  app.component("ChatInterface", ChatInterface);
}

export {
  install,
  ChatInterface,
  useChatInterface
};
