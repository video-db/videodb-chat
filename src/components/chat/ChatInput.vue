<template>
  <div>
    <div
      v-if="showAgentList"
      class="vdb-c-shadow-md vdb-c-absolute vdb-c-ml-32 vdb-c--translate-y-full vdb-c-transform vdb-c-rounded-md vdb-c-bg-white"
    >
      <div
        class="vdb-c-overflow-y-auto vdb-c-rounded-lg vdb-c-border vdb-c-border-[#EFEFEF] vdb-c-px-8 vdb-c-py-4"
      >
        <div
          v-for="(agent, index) in filteredAgents"
          :key="index"
          :class="[
            'vdb-c-my-2 vdb-c-cursor-pointer vdb-c-truncate vdb-c-rounded-lg vdb-c-p-8 vdb-c-pr-32 vdb-c-text-sm vdb-c-font-normal vdb-c-text-black vdb-c-transition-all vdb-c-duration-300 hover:vdb-c-bg-[#EFEFEF]',
            { 'vdb-c-bg-[#EFEFEF]': index === selectedAgentIndex },
          ]"
          @click="selectAgent(agent)"
        >
          <span class="vdb-c-text-[#EC5B16]"> @ </span>
          <span> {{ agent.name }} </span>
        </div>
      </div>
    </div>
    <div
      class="vdb-c-absolute vdb-c-left-0 vdb-c-top-0 vdb-c-h-full vdb-c-w-full vdb-c-px-10 vdb-c-py-8 md:vdb-c-p-18"
    >
      <div class="vdb-c-br-50 vdb-c-relative vdb-c-h-full vdb-c-w-full">
        <form
          class="vdb-c-br-50 vdb-c-flex vdb-c-h-full vdb-c-w-full vdb-c-items-center vdb-c-justify-between vdb-c-overflow-hidden vdb-c-border vdb-c-border-solid vdb-c-bg-white"
          :class="{
            'vdb-c-border-kilvish-500': inputFocused,
            'vdb-c-border-kilvish-400': !inputFocused,
          }"
          autocomplete="off"
          @submit="handleSubmit"
        >
          <div>
            <div
              :class="[
                'vdb-c-ml-6 vdb-c-flex vdb-c-items-center vdb-c-gap-24 vdb-c-rounded-[42px] vdb-c-border vdb-c-border-[#FFCFA5] vdb-c-bg-[#FFF5EC] vdb-c-px-12 vdb-c-py-12 vdb-c-pr-16 vdb-c-text-black',
                { 'vdb-c-animate-pulse': !contextData?.name },
              ]"
            >
              <span
                class="context-icon vdb-c-ml-12 vdb-c-h-8 vdb-c-w-8 vdb-c-rounded-full vdb-c-border vdb-c-border-white"
              >
              </span>
              <span
                class="vdb-c-max-w-[160px] vdb-c-truncate vdb-c-text-sm vdb-c-font-bold"
              >
                {{ contextData?.name || "Loading..." }}
              </span>
            </div>
          </div>
          <div class="vdb-c-relative vdb-c-flex-grow">
            <input
              ref="inputRef"
              class="vdb-c-chat-input vdb-c-h-full vdb-c-w-full vdb-c-bg-white vdb-c-pl-16 vdb-c-pr-8 vdb-c-font-medium vdb-c-text-[#1D2736] vdb-c-placeholder-kilvish-500 focus:vdb-c-outline-none"
              name="prompt"
              :placeholder="placeholder"
              autocomplete="off"
              :disabled="inputDisabled"
              :value="chatInput"
              @input="handleInput"
              @focus="inputFocused = true"
              @blur="handleBlur"
              @keydown="handleKeyDown"
            />
          </div>
          <div class="vdb-c-flex vdb-c-items-center vdb-c-justify-end">
            <button
              :disabled="isInputDisabled"
              class="vdb-c-font-sans vdb-c-mx-8 vdb-c-hidden vdb-c-h-40 vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-p-12 vdb-c-text-sm vdb-c-font-bold vdb-c-uppercase vdb-c-text-white vdb-c-transition md:vdb-c-flex"
              :class="{
                'vdb-c-cursor-not-allowed vdb-c-bg-kilvish-400':
                  isInputDisabled,
                'vdb-c-cursor-pointer vdb-c-bg-primary hover:vdb-c-bg-primary-800':
                  !isInputDisabled,
              }"
              type="submit"
            >
              <span class="vdb-c-inline">Send</span>
              <chat-enter-icon class-name="vdb-c-ml-4" />
            </button>
            <button
              class="vdb-c-mobile-send vdb-c-flex vdb-c-border-none vdb-c-bg-transparent vdb-c-p-8 vdb-c-pr-12 md:vdb-c-hidden"
              :class="{
                'vdb-c-text-kilvish-400': isInputDisabled,
                'vdb-c-mobile-send vdb-c-text-others-nightwing':
                  !isInputDisabled,
              }"
              type="submit"
            >
              <send-icon class-name="vdb-c-w-24 vdb-c-h-24" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

import { useVideoDBChat } from "../../context";

import ChatEnterIcon from "../icons/ChatEnterIcon.vue";
import SendIcon from "../icons/SendIcon.vue";

const props = defineProps({
  inputDisabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "Ask a question",
  },
  isTablet: {
    type: Boolean,
    default: false,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
  agents: {
    type: Array,
    default: [],
  },
  contextData: {
    type: Object,
    default: null,
  },
});

const { chatInput } = useVideoDBChat();

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
  return props.inputDisabled || charCount.value < 1;
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
  }
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

const handleSubmit = (e) => {
  e.preventDefault();
  if (!showAgentList.value) {
    emit("on-submit", chatInput.value);
    e.target.reset();
    chatInput.value = "";
    charCount.value = 0;
    resetTag();
  }
};

defineExpose({
  focus,
});
</script>

<style>
.vdb-c-br-50 {
  border-radius: 50px;
}

.vdb-c-chat-input {
  flex-grow: 1;
}

.vdb-c-chat-input::placeholder {
  font-weight: 400;
}

.vdb-c-chat-enter-button {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 2fr 3fr;
}

.context-icon {
  background: radial-gradient(circle, #ff7f40 0%, #f55100 100%);
  box-shadow: 0 0 6px 4px rgba(255, 90, 10, 0.6);
}
</style>
