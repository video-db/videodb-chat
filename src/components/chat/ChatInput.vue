<template>
  <div>
    <div
      v-if="showAgentList"
      class="vdb-c-absolute vdb-c-z-50 vdb-c-w-full vdb-c--translate-y-full vdb-c-transform vdb-c-px-18"
    >
      <div
        class="vdb-c-max-h-[160px] vdb-c-overflow-y-auto vdb-c-rounded-lg vdb-c-border-2 vdb-c-border-roy vdb-c-bg-white vdb-c-px-8 vdb-c-py-4 vdb-c-shadow-lg"
      >
        <div
          v-for="(agent, index) in filteredAgents"
          :key="index"
          :class="[ 
            'vdb-c-my-2 vdb-c-cursor-pointer vdb-c-truncate vdb-c-rounded-lg vdb-c-p-8 vdb-c-pr-32 vdb-c-text-sm vdb-c-font-normal vdb-c-text-black vdb-c-transition-all vdb-c-duration-300 hover:vdb-c-bg-roy',
            { 'vdb-c-bg-roy': index === selectedAgentIndex },
          ]"
          @click="selectAgent(agent)"
        >
          <span class="vdb-c-text-orange"> @ </span>
          <span> {{ agent.name }} </span>
        </div>
      </div>
    </div>
    <div class="chat-container">
      <div v-if="showPreview" class="image-preview-container">
        <div class="image-preview">
          <img :src="pastedImage" alt="Image Preview" />
          <button class="close-button" @click="removePastedImage">×</button>
        </div>
      </div>
      <div class="chat-content"></div>

      <!-- Action Buttons Section -->
      <div class="action-buttons-wrapper vdb-c-flex vdb-c-items-center vdb-c-gap-4">
        <!-- Upload Button -->
        <label>
          <input
            id="upload"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileUpload"
          />
          <svg class="upload-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.44 11.05L12.96 19.53c-2.04 2.04-5.36 2.04-7.4 0s-2.04-5.36 0-7.4l8.48-8.48c1.5-1.5 3.92-1.5 5.42 0s1.5 3.92 0 5.42L9.05 17.37c-.88.88-2.3.88-3.18 0s-.88-2.3 0-3.18l7.96-7.96"/>
          </svg>
        </label>

        <!-- Textarea -->
        <textarea
          ref="inputRef"
          type="text"
          class="vdb-c-chat-input"
          :placeholder="placeholder"
          autocomplete="off"
          :value="chatInput"
          @input="handleInput"
          @focus="inputFocused = true"
          @blur="handleBlur"
          @keydown="handleKeyDown"
          @paste="handlePaste"
        ></textarea>

        <!-- Send Button -->
        <div class="fix-send">
          <button
            :disabled="isInputDisabled"
            class="vdb-c-font-sans vdb-c-mx-8 vdb-c-h-40 vdb-c-cursor-pointer vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-bg-orange vdb-c-px-12 vdb-c-py-8 vdb-c-text-sm vdb-c-font-bold vdb-c-uppercase vdb-c-text-white vdb-c-transition hover:vdb-c-bg-orange-400 md:vdb-c-flex"
            :class="{
              'vdb-c-cursor-not-allowed vdb-c-bg-kilvish-400 hover:vdb-c-bg-kilvish-400': charCount < 1,
            }"
            type="submit"
            @click="handleSubmit"
          >
            <EllipsesLoading v-if="chatLoading" />
            <div v-else class="vdb-c-flex vdb-c-items-center vdb-c-pl-4">
              <span class="vdb-c-inline">Send</span>
              <chat-enter-icon class-name="vdb-c-ml-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useVideoDBChat } from "../../context";
import ChatEnterIcon from "../icons/ChatEnter.vue";
import SendIcon from "../icons/Send.vue";
import EllipsesLoading from "./elements/EllipsesLoading.vue";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Ask a question",
  },
  agents: {
    type: Array,
    default: () => [],
  },
  contextData: {
    type: Object,
    default: null,
  },
});

const { chatInput, chatLoading } = useVideoDBChat();

const emit = defineEmits(["on-submit", "on-change", "tag-agent"]);

const charCount = ref(0);
const inputFocused = ref(false);
const inputRef = ref(null);
const showAgentList = ref(false);
const agentStartIndex = ref(-1);
const agentQuery = ref("");
const selectedAgentIndex = ref(0);

const focus = () => {
  inputRef.value.focus();
};

const filteredAgents = computed(() => {
  if (!agentQuery.value) return props.agents;
  return props.agents.filter((agent) =>
    agent.name.toLowerCase().includes(agentQuery.value.toLowerCase()),
  );
});

watch(filteredAgents, () => {
  selectedAgentIndex.value = 0;
});

const isInputDisabled = computed(() => {
  return chatLoading.value || (charCount.value < 1 && !pastedImage.value);
});

const handleInput = (e) => {
  const newValue = e.target.value;
  chatInput.value = newValue;

  const lastAtIndex = newValue.lastIndexOf("@");
  const lastSpaceIndex = newValue.lastIndexOf(" ");

  if (lastAtIndex !== -1 && lastAtIndex > lastSpaceIndex) {
    agentStartIndex.value = lastAtIndex;
    agentQuery.value = newValue.slice(lastAtIndex + 1);
    showAgentList.value = true;
  } else {
    showAgentList.value = false;
  }
  adjustHeight(); // Adjust height dynamically
};

const resetTag = () => {
  showAgentList.value = false;
  agentStartIndex.value = -1;
  agentQuery.value = "";
  selectedAgentIndex.value = 0;
};

const handleBlur = () => {
  inputFocused.value = false;
  // Delay hiding the tag list to allow for tag selection
  setTimeout(() => {
    showAgentList.value = false;
  }, 200);
};

const handleKeyDown = (e) => {
  if (showAgentList.value) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedAgentIndex.value = Math.max(0, selectedAgentIndex.value - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedAgentIndex.value = Math.min(
        filteredAgents.value.length - 1,
        selectedAgentIndex.value + 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectAgent(filteredAgents.value[selectedAgentIndex.value]);
    } else if (e.key === "Escape") {
      resetTag();
    }
  } else if (e.key === "@") {
    agentStartIndex.value = e.target.selectionStart;
    showAgentList.value = true;
  } else if (e.key === "Enter" && !e.shiftKey) {
    if (chatInput.value.trim() !== "" || pastedImage.value) {
      handleSubmit(e);
    } else {
      e.preventDefault();
    }
  } else if (e.shiftKey && e.key === "Enter") {
    adjustHeight(); // Adjust height on Shift+Enter
    return;
  }
};

const pastedImage = ref(null); // To store the Base64 image data
const showPreview = ref(false); // To control the visibility of the preview

const handlePaste = (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  const items = clipboardData.items;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === "file" && item.type.startsWith("image/")) {
      const file = item.getAsFile();

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          pastedImage.value = e.target.result; // Save the Base64 string
          showPreview.value = true; // Show the image preview
        };
        reader.readAsDataURL(file);
      }

      event.preventDefault(); // Prevent default paste behavior
      return;
    }
  }
};

const removePastedImage = () => {
  pastedImage.value = null;
  showPreview.value = false;
};

const selectAgent = (agent) => {
  const beforeAgent = chatInput.value.slice(0, agentStartIndex.value);
  const afterAgent = chatInput.value.slice(
    agentStartIndex.value + agentQuery.value.length + 1,
  );
  chatInput.value = `${beforeAgent}@${agent.name} ${afterAgent}`;
  inputRef.value.focus();
  resetTag();
  emit("tag-agent", agent);
};

watch(
  chatInput,
  (newValue) => {
    charCount.value = newValue.length;
  },
  { immediate: true },
);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      pastedImage.value = e.target.result; // Base64 string
      showPreview.value = true;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (!showAgentList.value && (chatInput.value.trim() !== "" || pastedImage.value)) {
    emit("on-submit", chatInput.value);
    chatInput.value = "";
    pastedImage.value = null;
    showPreview.value = false;
    charCount.value = 0;
    resetTag();
  }
};

const adjustHeight = () => {
  const textarea = inputRef.value;
  const container = textarea.closest(".vdb-c-relative");

  textarea.style.height = "auto";
  const newHeight = Math.min(textarea.scrollHeight, 300);
  textarea.style.height = `${newHeight}px`;

  if (container) {
    container.style.height = "auto";
    container.style.height = `${newHeight + 20}px`;
  }
};

defineExpose({
  focus,
});
</script>

<style>
/* Shared Styling */
.vdb-c-br-50 {
  border-radius: 50px;
}

/* Chat Input */
.vdb-c-chat-input {
  flex-grow: 1;
  padding: 0 12px;
  height: 40px;
  background-color: #ffffff;
  color: black;
  font-size: 14px;
  line-height: 40px;
  outline: none;
  resize: none;
  overflow-y: auto;
  box-sizing: border-box;
  margin-right: 110px;
}

.vdb-c-chat-input::placeholder {
  font-weight: 400;
  color: #cccccc;
}

.vdb-c-chat-input:focus,
.vdb-c-chat-input:focus-visible {
  outline: none;
  border: none;
}


/* Chat Container */
.chat-container {
  position: absolute;
  left: 0;
  bottom: 0;
  width: calc(100% - 40px);
  margin: -20px 20px 10px;
  padding-left: 5px;
  padding-bottom: 13px;
  max-height: 70vh;
  height: auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border: 1px solid #000;
  border-radius: 40px;
  background-color: #ffffff;
}

.chat-content {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}

/* Image Preview */
.image-preview-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  position: relative;
  padding-left: 16px;
  padding-top: 16px;
}

.image-preview {
  position: relative;
  border: 1px solid #ddd;
  width: 65px;
  height: 65px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview img {
  width: 90%;
  height: 90%;
  object-fit: cover;
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
  background: black;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 20px;
  height: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(50%, -50%);
}

/* Action Buttons Wrapper */
.action-buttons-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0px 0;
  margin: 0;
}

/* Buttons (Upload and Send) */
.upload-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-45deg);
  padding-left: 10px;
  padding-top: 10px;
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #F97316;
  border: 1px solid #ffffff;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  margin-bottom: 20px;
}

.send-button:disabled {
  background-color: #ddd; /* Disabled state for send button */
  cursor: not-allowed;
}

.fix-send {
  position: fixed;
  right: 0;
  bottom: 0;
  margin-bottom: 20px;
  margin-right: 30px;
}

/* SVG Icons */
.icon {
  width: 20px;
  height: 20px;
  fill: #fff;
  transition: fill 0.3s ease;
}

.icon:hover {
  fill: #ffffff;
}

/* Hidden Elements */
.hidden {
  display: none;
}

textarea:focus::-webkit-input-placeholder,
textarea:focus::-moz-placeholder,
textarea:focus:-ms-input-placeholder,
textarea:focus::-ms-input-placeholder {
  outline: none;
  border: none;
  color: #cccccc;
}

</style>
