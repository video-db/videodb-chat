[![NPM version][npm-shield]][npm-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Website][website-shield]][website-url]
[![Discord][discord-shield]][discord-url]

<br />

<p align="center">
  <a href="https://videodb.io/">
    <img src="https://codaio.imgix.net/docs/_s5lUnUCIU/blobs/bl-RgjcFrrJjj/d3cbc44f8584ecd42f2a97d981a144dce6a66d83ddd5864f723b7808c7d1dfbc25034f2f25e1b2188e78f78f37bcb79d3c34ca937cbb08ca8b3da1526c29da9a897ab38eb39d084fd715028b7cc60eb595c68ecfa6fa0bb125ec2b09da65664a4f172c2f" alt="Logo" width="300" height="">
  </a>

  <h3 align="center">VideoDB Chat</h3>

  <p align="center">
    Chat UI Components for <a href="https://github.com/video-db/video-agents">  Video Agents</a>
    <br />
    <a href="https://stackblitz.com/edit/vitejs-vite-zyq2no?file=src%2FApp.vue"><strong>View Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/video-db/videodb-chat/issues">Report Bug</a>
    ·
    <a href="https://github.com/video-db/videodb-chat/issues">Request Feature</a>
  </p>
</p> 

# 💬 VideoDB Chat

These are Chat UI components to use with [Video Agents](https://github.com/video-db/video-agents).


# 🚀 Quickstart

### Installation
```
npm install @videodb/chat-vue
```

### Usage

Import the necessary components and styles. 

If you are using [video-agents backend](https://github.com/video-db/video-agents), make sure it is running and the socket url is correctly passed in `chat-hook-config`  

> If you want to setup videodb-chat with your own backend, checkout [custom chatHook](#custom-chatHook) section

```html
<script setup>
  import { ref } from "vue";
  import { ChatInterface } from "@videodb/chat-vue";
  import "@videodb/chat-vue/dist/style.css";

  const isChatOpened = ref(true);
  const sessionId = Date.now();
  const collectionId = "default";

  // Set videoId to Chat With Video
  const videoId = null;

  const backendUrl = "http://127.0.0.1:8000/chat";
</script>

<template>
  <ChatInterface
    v-if="isChatOpened"
    :chat-hook-config="{
      sessionId: sessionId,
      collectionId: collectionId,
      videoId: videoId,
      url: backendUrl,
      debug: true,
    }"
    @backBtnClick="isChatOpened = false"
  />
</template>
```

# 🧑‍💻 Advanced Usage

## Custom ChatHook

The Custom ChatHook is an advanced feature of this package that allows you to:
- Connect to your own backend, bypassing VideoDB's video agent integration.
- Develop custom logic for agent interactions.
- Control conversation state and manage side effects.

To use a Custom Hook, pass a function to the `customChatHook` prop. This function should return an object with the following properties:

- `conversations`: Object (reactive object)  
  Checkout [conversations](#conversations) section for more details.

- `addMessage`: Function   
  Adds a message to the conversation. This function is called when the user clicks the `Send` button or any search suggestion. 

- `chatLoading`: Boolean (reactive value)  
  Indicates whether the chat is loading.

[View Custom Hook Example on StackBlitz](https://stackblitz.com/edit/vitejs-vite-knrrbv?file=src%2FApp.vue)

### Implementing Custom Message Handlers

Custom message handlers allow you to register custom UI components for various message types. This is particularly useful when adding new agents that require UI elements beyond simple text input/output in the chat, such as video, image, audio, etc.

The `ChatInterface` component exposes a method `registerMessageHandler` that can be accessed via `ref` to register custom message handlers. This function accepts two arguments:
- `agentName`: String - The name of the agent for which the message handler is registered. The handler will be used for messages whose `agent_type` matches `agentName`.
- `handler`: Component - The UI Component to be rendered for the message type.

The handler component will receive the following props:
- `message`: Object - The message object.
- `searchTerm`: String - The search term.

[View Custom Message Handler Example on StackBlitz](https://stackblitz.com/edit/vitejs-vite-qnka6j?file=src%2FApp.vue)

# 📡 Interface

## ChatInterface

### Props

The ChatInterface component accepts the following props:


- `customChatHook`: Function (default: videoDBChatHook)
  Allows for a custom hook to handle chat functionality.

- `chatHookConfig`: Object
Configures the chat hook. For the default chat hook, it includes:

  - `url`: String (default: `http://127.0.0.1:8000/chat`) - URL for the chat backend socket.
  - `sessionId`: String (default: generated UUID) - Unique identifier for the chat session.
  - `collectionId`: String (default: null) - ID of the collection.
  - `videoId`: String (default: null) - ID of the video.
  - `debug`: Boolean (default: false) - Enables debug mode.

- `chatInputPlaceholder`: String (default: "Ask a question")
Customizes the placeholder text for the chat input field.

- `searchSuggestions`: Array (default: [])
  Provides a list of search suggestions. Each suggestion should be an object with the format `{ "text": "search suggestion" }`.

- `shareUrl`: String (default: "")
  Specifies the URL for sharing the chat.

- `size`: String (default: `full`)
  Determines the size of the chat interface. Options are `full` or `embedded`.
  Full takes up the entire width of the screen.
  Embedded takes up space of the parent container.

- `userImage`: String(url or path) or Component (default: Placeholder User Icon)
  Specifies the image or component to represent user messages in the chat.

- `assistantImage`: String or Component (default: Placeholder Assistant Icon)
  Defines the image or component for assistant messages.

- `emptyContainerLogo`: String or Component (default: Placeholder Logo)
  Sets the logo displayed when the chat is empty.

### Exposed Variables


#### State Variables
- `conversations`: Object   
  Checkout [conversations](#conversations) section for more details.

#### Methods
- `addMessage(message)`: Function
  Adds a message to the conversation. 

  **Arguments:**
  - `message`: Object
    - `content`: String - Text content of the message. (required)


## Conversations

Collection of conversations. Each conversation is stored as a key-value pair, where:
  - The key represents the sessionId, which is the unique identifier for the conversation.
  - The value is the [conversation object](#conversation)

## Conversation

Conversation is a collection of messages exchanged between a user and an agent within a session. Each message is stored as a key-value pair, where:
- The key represents the msgId, which is the unique identifier for the message.
- The value is the message object, which contains the following fields:

**Message Object Fields**:
- `agent_type`: The type of agent that generated the message (e.g., bot, human, system).
- `content`: The text content of the message, which can be either input (from the user) or output (from the agent).
- `data`: Any JSON data associated with the message, containing additional context or metadata related to the agent's response.
- `sender`: Specifies the sender of the message, which could be either the assistant or the user.
- `status`: The status of the message, indicating its current state (e.g., progress, success, error).


[npm-shield]: https://img.shields.io/npm/v/@videodb/chat-vue?style=for-the-badge
[npm-url]: https://www.npmjs.com/package/@videodb/chat-vue
[discord-shield]: https://img.shields.io/badge/dynamic/json?style=for-the-badge&url=https://discord.com/api/invites/py9P639jGz?with_counts=true&query=$.approximate_member_count&logo=discord&logoColor=blue&color=green&label=discord
[discord-url]: https://discord.com/invite/py9P639jGz
[stars-shield]: https://img.shields.io/github/stars/video-db/videodb-chat.svg?style=for-the-badge
[stars-url]: https://github.com/video-db/videodb-chat/stargazers
[issues-shield]: https://img.shields.io/github/issues/video-db/videodb-chat.svg?style=for-the-badge
[issues-url]: https://github.com/video-db/videodb-chat/issues
[website-shield]: https://img.shields.io/website?url=https%3A%2F%2Fvideodb.io%2F&style=for-the-badge&label=videodb.io
[website-url]: https://videodb.io/
