import type { App } from "vue";
import ChatInterface from "./components/chat/ChatInterface.vue";
import DefaultScreen from "./components/chat/elements/DefaultScreen.vue";
import Sidebar from "./components/chat/elements/Sidebar.vue";
import { useVideoDBChat } from "./context";
import "./style.css";

function install(app: App) {
  app.component("ChatInterface", ChatInterface);
}

export { install, ChatInterface, DefaultScreen, Sidebar, useVideoDBChat };
