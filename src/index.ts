import type { App } from "vue";
import ChatInterface from "./components/chat/ChatInterface.vue";
import { useVideoDBChat } from "./context";
import "./style.css";

function install(app: App) {
  app.component("ChatInterface", ChatInterface);
}

export { install, ChatInterface, useVideoDBChat };
