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
    Chat UI Components for <a href="https://github.com/video-db/Director">  Director</a>
    <br />
    <a href="https://codesandbox.io/p/sandbox/nifty-mendeleev-tnxpnt"><strong>View Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/video-db/videodb-chat/issues">Report Bug</a>
    ·
    <a href="https://github.com/video-db/videodb-chat/issues">Request Feature</a>
  </p>
</p>

# 💬 VideoDB Chat

These are Chat UI components to use with [Director](https://github.com/video-db/Director).

# 🚀 Quickstart

### Installation

```
npm install @videodb/chat-vue
```

### Usage

Import the necessary components and styles.

If you are using [Director](https://github.com/video-db/Director), make sure it's backend is running and the socket url is correctly passed in `chat-hook-config`

```html
<script setup>
  import { ChatInterface } from "@videodb/chat-vue";
  import "@videodb/chat-vue/dist/style.css";

  const socketUrl = "http://127.0.0.1:8000/chat";
  const httpUrl = "http://127.0.0.1:8000";
</script>

<template>
  <div>
    <ChatInterface
      :chat-hook-config="{
        socketUrl: socketUrl,
        httpUrl: httpUrl,
        debug: true,
      }"
    />
  </div>
</template>
```

# 📖 Application Flow

![Structure](https://github.com/user-attachments/assets/3dd8feaa-483a-4f28-bfd2-e8bc23dfffea)



The `ChatInterface` component is composed of two primary sub-components:

- `<ChatMessageContainer/>`
- `<ChatMessageInput/>`

### `<ChatMessageContainer/>`

This component displays both past and current conversations within a session. Conversations are stored in the `conversations` variable, a reactive object exported by the chat hook. This variable updates in real-time as the conversation progresses.

Each conversation consists of input and output messages, which are rendered as `<ChatMessage/>` components. Output messages can contain various content types such as `text`, `video`, or `image`. These are rendered by their respective message handlers.

> ℹ️ **Note:** To add support for additional content types, please refer to the [Custom Message Handler](#-custom-message-handler) section.

### `<ChatMessageInput/>`

When a user sends a message, this component calls the `addMessage()` function, which in turn invokes the `addMessage` function of the chat hook.

### Default Chat Hook

The default chat hook is `videoDBChatHook`, which integrates with [Director](https://github.com/video-db/Director).

> ℹ️ **Note:** To configure your own chat hook, please refer to the [Custom ChatHook](#-custom-chathook) section.

# 🧑‍💻 Additional Components

_This package includes other UI components that enhance the chat experience_

![image (1)](https://github.com/user-attachments/assets/f4524358-882b-4563-9d0b-b5c864d46dd4)


### `<Sidebar/>`

This component facilitates navigation between different sessions and collections. It can be used to switch between various conversations or collections.

> You can customize the branding of the sidebar by passing a `sidebarConfig` prop to `<ChatInterface/>`.

### `<DefaultScreen/>`

This component displays the default screen when there are no conversations in the chat. It showcases the agents and action cards.

> You can configure the `DefaultScreen` by passing a `defaultScreenConfig` prop to `<ChatInterface/>`.

### `<CollectionView/>` and `<VideoView/>`

These components are used to display collection and video views, helping users better understand the context of the conversation.

# 🧑‍💻 Concepts 

### 🔧 Message Handlers

---

Message handlers are UI components that are used to render the content of a message that are in `conversations` object. They are registered with the `ChatInterface` component and are used to render the content of messages that have a content type that matches the `contentType` of the handler.

These are the default message handlers that are currently supported by this package:

**Text**:  
---
  `contentType`: `text`   
  _Renders the text/markdown of the message_    
     
![TextResponse](https://github.com/user-attachments/assets/6e7cb7a8-0f5a-473d-8b46-a104da92922d)

  [View implementation](https://github.com/video-db/videodb-chat/blob/main/src/components/message-handlers/TextResponse.vue)

**Video**:  
---
  `contentType`: `video`  
  _Renders the video(streaming urls) of  the message_
     
  ![chatvideo](https://github.com/user-attachments/assets/e3b07ad3-5258-42c0-9276-49321d840e95)


  [View implementation](https://github.com/video-db/videodb-chat/blob/main/src/components/message-handlers/ChatVideo.vue)

**Image**:  
---
  `contentType`: `image`  
  _Renders the image of the message_    
  
![ImageHandler](https://github.com/user-attachments/assets/afc02ffb-2704-43ab-8f62-c66e2a0c2178)


  [View implementation](https://github.com/video-db/videodb-chat/blob/main/src/components/message-handlers/ImageHandler.vue)

**Search Results**:  
---
  `contentType`: `search_results`  
  _Renders the search results of the video_ 
  
![ChatSearchResults](https://github.com/user-attachments/assets/2192a1c0-def2-4472-9c08-14e08d66f6da)

  [View implementation](https://github.com/video-db/videodb-chat/blob/main/src/components/message-handlers/ChatSearchResults.vue)


### 🔧 Custom Message Handler

---

_Custom message handlers allow you to register specialized UI components for various content types. This is particularly useful when adding new agents that require UI elements beyond the currently supported types._

The `ChatInterface` component exposes a method `registerMessageHandler` accessible via `ref`, enabling you to register custom message handlers. This function accepts two arguments:

- `contentType`: _String_  
  The name of the agent for which the message handler is registered. The handler will be used for content types where message's content has a content type that matches `contentType`.

- `handler`: _Component_  
  The UI component to be rendered for the message type.

**The handler component will receive the following props:**

- `content`: _Object_  
  The content object of matched content type.

- `isLastConv`: _Boolean_  
  Indicates if the message is the last conversation.

**Checkout these resources to understand better:**

- [View default message handlers Implementation](https://github.com/video-db/videodb-chat/blob/main/src/components/message-handlers/)
### 🔧 Custom ChatHook

---

The Custom ChatHook is an advanced feature of this package that allows you to:

- Connect to your own backend, bypassing or configuring Director's default backend.
- Develop custom logic for agent interactions.
- Control conversation state and manage side effects.

To use a custom hook, pass a function to the `customChatHook` prop. This function should return an object with the following properties:
- `session`: _Object_ (reactive)  
  Session object.
  ```js
  {
    isConnected: false,
    sessionId: null,
    videoId: null,
    collectionId: "default",
  }
  ```

- `collections`: _Array_ (reactive)  
  List of collections.

- `sessions`: _Array_ (reactive)  
  List of sessions.

- `agents`: _Array_ (reactive)  
  List of agents.

- `activeCollectionData`: _Object_ (reactive)  
  Data of the collection in context.

- `activeCollectionVideos`: _Array_ (reactive)  
  List of videos of the collection in context.

- `activeVideoData`: _Object_ (reactive)  
  Data of the video in context.

- `conversations`: _Object_ (reactive)  
  See the [Conversations](#conversations) section for more details.

- `addMessage()`: _Function_  
  Adds a message to the conversation. This function is called when the user clicks the **Send** button

- `loadSession()`: _Function_  
  Loads a session. This function is called either when new session needs to be created or when the user clicks on a past session from sidebar.
  When new session needs to be create, no arguments are passed to the function.
  When the user clicks on a past session, the `sessionId` is passed as an argument.

**Checkout these resources to understand better:**

- [View default chat hook Implementation](https://github.com/video-db/videodb-chat/blob/main/src/components/hooks/useVideoDBAgent.js)
- [View custom chat hook example on CodeSandbox](https://codesandbox.io/p/sandbox/nifty-mendeleev-tnxpnt)

# 📡 Interface

## ChatInterface

### Props

The ChatInterface component accepts the following props:

- `chatInputPlaceholder`: 
  - default: "Ask Speilberg"
  - Customizes the placeholder text for the chat input field.

- `size(string)`: 
  - default: full  
  - Determines the size of the chat interface. Options are `full` or `embedded`.
      Full takes up the entire width of the screen.
      Embedded takes up space of the parent container.

- `customChatHook(Function)`: 
  - default: [videoDBChatHook](https://github.com/video-db/videodb-chat/blob/main/src/components/hooks/useVideoDBAgent.js)
  - Allows for a custom hook to handle chat functionality.

- `chatHookConfig(object)`: 
  - Configures the chat hook. For the default chat hook, it includes:
  - default
    ```js
      socketUrl: "http://127.0.0.1:8000/chat",
      httpUrl: "http://127.0.0.1:8000",
      debug: false,
    ```

- `sidebarConfig(string)`: 
  - Customizes the sidebar.  
  - default:
    ```js
    {
          icon: DirectorIcon,
          links: [
            {
              href: "https://docs.videodb.io",
              text: "Documentation",
            },
          ]
    }
    ```

- `defaultScreenConfig(Object)`: 
  - default: a list of action cards with default queries  
  - Customizes the default screen.

### Exposed Variables

#### State Variables

- `conversations`: Object  

#### Methods

- `addMessage(message)`:   
    Adds a message to the conversation.
- `registerMessageHandler(contentType, handler)`:   
  Registers a custom message handler for a specific content type.



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
