<template>
  <div
    class="vdb-c-absolute vdb-c-left-0 vdb-c-top-0 vdb-c-h-full vdb-c-w-full vdb-c-px-10 vdb-c-py-8 md:vdb-c-p-18"
  >
    <div
      class="vdb-c-br-50 vdb-c-relative vdb-c-h-full vdb-c-w-full"
      :class="{
        'vdb-c-border-3 vdb-c-border-primary-500':
          inputFocused && charCount > 150,
      }"
    >
      <form
        class="vdb-c-br-50 vdb-c-flex vdb-c-h-full vdb-c-w-full vdb-c-justify-between vdb-c-overflow-hidden vdb-c-border vdb-c-border-solid vdb-c-bg-white"
        :class="{
          'vdb-c-border-primary': charCount > 150,
          'vdb-c-border-kilvish-500': inputFocused && charCount <= 150,
          'vdb-c-border-kilvish-400': !inputFocused && charCount === 0,
        }"
        autocomplete="off"
        @submit="handleSubmit"
      >
        <input
          class="vdb-c-chat-input vdb-c-h-full vdb-c-bg-white vdb-c-pl-24 vdb-c-pr-8 vdb-c-font-medium vdb-c-text-[#1D2736] vdb-c-placeholder-kilvish-500 focus:vdb-c-outline-none"
          name="prompt"
          :placeholder="placeholder"
          autocomplete="off"
          :disabled="inputDisabled"
          :value="chatInput"
          @input="handleInput"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
        />
        <div class="vdb-c-flex vdb-c-items-center vdb-c-justify-end">
          <button
            :disabled="isInputDisabled"
            class="vdb-c-font-sans vdb-c-mx-8 vdb-c-hidden vdb-c-h-40 vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-p-12 vdb-c-text-sm vdb-c-font-bold vdb-c-uppercase vdb-c-text-white vdb-c-transition md:vdb-c-flex"
            :class="{
              'vdb-c-cursor-not-allowed vdb-c-bg-kilvish-400': isInputDisabled,
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
              'vdb-c-mobile-send vdb-c-text-others-nightwing': !isInputDisabled,
            }"
            type="submit"
          >
            <send-icon class-name="vdb-c-w-24 vdb-c-h-24" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

import { useVideoDBChat } from "../../context";

import ChatEnterIcon from "../icons/ChatEnterIcon.vue";
import ChatInputIcon from "../icons/ChatInputIcon.vue";
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
});

const { chatInput } = useVideoDBChat();

const emit = defineEmits(["onSubmit", "onChange"]);

const charCount = ref(0);
const inputFocused = ref(false);

const isInputDisabled = computed(() => {
  return props.inputDisabled || charCount.value < 1 || charCount.value > 150;
});

const handleInput = (e) => {
  chatInput.value = e.target.value;
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
  emit("onSubmit", chatInput.value);
  e.target.reset();
  chatInput.value = "";
  charCount.value = 0;
};
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
</style>
