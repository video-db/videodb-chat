<template>
  <div
    v-if="showDialog"
    class="vdb-c-fixed vdb-c-inset-0 vdb-c-z-50 vdb-c-flex vdb-c-items-center vdb-c-justify-center vdb-c-bg-black-64"
    @click="closeModal"
  >
    <div
      class="vdb-c-mx-16 vdb-c-w-full vdb-c-max-w-[600px] vdb-c-rounded-lg vdb-c-bg-white vdb-c-p-24"
      @click.stop
    >
      <!-- Header -->
      <div
        class="vdb-c-mb-16 vdb-c-flex vdb-c-items-center vdb-c-justify-between"
      >
        <h3 class="vdb-c-text-lg vdb-c-font-semibold vdb-c-text-black">
          Public link created
        </h3>
        <button
          @click="closeModal"
          class="vdb-c-text-gray-400 vdb-c-transition-colors hover:vdb-c-text-gray-600"
        >
          <CrossIcon />
        </button>
      </div>

      <!-- Description -->
      <p class="vdb-c-mb-16 vdb-c-text-sm vdb-c-text-gray-600">
        A public link to your chat has been created.
      </p>

      <!-- Loading State -->
      <div v-if="isLoading" class="vdb-c-mb-16">
        <div
          class="vdb-c-flex vdb-c-items-center vdb-c-gap-8 vdb-c-rounded-lg vdb-c-bg-gray-50 vdb-c-p-12"
        >
          <div
            class="vdb-c-h-16 vdb-c-w-16 vdb-c-animate-spin vdb-c-rounded-full vdb-c-border-2 vdb-c-border-gray-300 vdb-c-border-t-blue-500"
          ></div>
          <span class="vdb-c-text-sm vdb-c-text-gray-600"
            >Creating public link...</span
          >
        </div>
      </div>

      <!-- Link Display -->
      <div v-else-if="publicLink" class="vdb-c-mb-16">
        <div
          class="vdb-c-flex vdb-c-items-center vdb-c-gap-8 vdb-c-rounded-lg vdb-c-bg-gray-50 vdb-c-p-12"
        >
          <input
            :value="publicLink"
            readonly
            class="vdb-c-flex-1 vdb-c-border-none vdb-c-bg-transparent vdb-c-text-sm vdb-c-text-gray-800 vdb-c-outline-none"
          />
          <button
            @click="copyLink"
            :class="[
              'vdb-c-rounded-lg vdb-c-px-12 vdb-c-py-6 vdb-c-text-sm vdb-c-font-medium vdb-c-transition-colors',
              copied
                ? 'vdb-c-bg-green-100 vdb-c-text-green-700'
                : 'vdb-c-bg-black vdb-c-text-white hover:vdb-c-bg-gray-800',
            ]"
          >
            <template v-if="copied">
              <CheckIcon class="vdb-c-mr-4 vdb-c-inline" />
              Copied
            </template>
            <template v-else>
              <CopyIcon class="vdb-c-mr-4 vdb-c-inline" />
              Copy link
            </template>
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="vdb-c-mb-16">
        <div
          class="vdb-c-rounded-lg vdb-c-border vdb-c-border-red-200 vdb-c-bg-red-50 vdb-c-p-12"
        >
          <p class="vdb-c-text-sm vdb-c-text-red-600">{{ error }}</p>
        </div>
      </div>

      <!-- Social Media Sharing -->
      <div
        v-if="publicLink && !isLoading"
        class="vdb-c-flex vdb-c-items-center vdb-c-justify-center vdb-c-gap-16"
      >
        <button
          @click="shareOnLinkedIn"
          class="vdb-c-flex vdb-c-flex-col vdb-c-items-center vdb-c-gap-4 vdb-c-rounded-lg vdb-c-p-8 vdb-c-transition-colors hover:vdb-c-bg-gray-50"
        >
          <div
            class="vdb-c-flex vdb-c-h-32 vdb-c-w-32 vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-bg-blue-600"
          >
            <span class="vdb-c-text-xs vdb-c-font-bold vdb-c-text-white"
              >in</span
            >
          </div>
          <span class="vdb-c-text-xs vdb-c-text-gray-600">LinkedIn</span>
        </button>

        <button
          @click="shareOnReddit"
          class="vdb-c-flex vdb-c-flex-col vdb-c-items-center vdb-c-gap-4 vdb-c-rounded-lg vdb-c-p-8 vdb-c-transition-colors hover:vdb-c-bg-gray-50"
        >
          <div
            class="vdb-c-flex vdb-c-h-32 vdb-c-w-32 vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-bg-orange-500"
          >
            <span class="vdb-c-text-xs vdb-c-font-bold vdb-c-text-white"
              >r</span
            >
          </div>
          <span class="vdb-c-text-xs vdb-c-text-gray-600">Reddit</span>
        </button>

        <button
          @click="shareOnX"
          class="vdb-c-flex vdb-c-flex-col vdb-c-items-center vdb-c-gap-4 vdb-c-rounded-lg vdb-c-p-8 vdb-c-transition-colors hover:vdb-c-bg-gray-50"
        >
          <div
            class="vdb-c-flex vdb-c-h-32 vdb-c-w-32 vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-bg-black"
          >
            <span class="vdb-c-text-xs vdb-c-font-bold vdb-c-text-white"
              >X</span
            >
          </div>
          <span class="vdb-c-text-xs vdb-c-text-gray-600">X</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import CrossIcon from "../icons/Cross.vue";
import CopyIcon from "../icons/CopyIcon.vue";
import CheckIcon from "../icons/Check.vue";

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  sessionId: {
    type: String,
    default: "",
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  onMakePublic: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const isLoading = ref(false);
const publicLink = ref("");
const error = ref("");
const copied = ref(false);

const closeModal = () => {
  emit("close");
  // Reset state
  isLoading.value = false;
  publicLink.value = "";
  error.value = "";
  copied.value = false;
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(publicLink.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy link:", err);
  }
};

const shareOnLinkedIn = () => {
  const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent("Check out this chat session from VideoDB Director! \n" + publicLink.value)}`;
  window.open(url, "_blank");
};

const shareOnReddit = () => {
  const url = `https://reddit.com/submit?url=${encodeURIComponent(publicLink.value)}&title=Check out this chat session`;
  window.open(url, "_blank");
};

const shareOnX = () => {
  const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(publicLink.value)}&text=Check out this chat session`;
  window.open(url, "_blank");
};

const initializeShare = async (sid) => {
  if (!sid || !props.showDialog) return;
  if (props.isPublic) {
    publicLink.value = `${window.location.origin}/share/${sid}`;
    isLoading.value = false;
    error.value = "";
    return;
  }
  isLoading.value = true;
  error.value = "";
  publicLink.value = "";
  try {
    const result = await props.onMakePublic(sid);
    if (result.success) {
      publicLink.value = `${window.location.origin}/share/${sid}`;
    } else {
      error.value = result.error || "Failed to create public link";
    }
  } catch (err) {
    error.value = "Failed to create public link";
    console.error("Error making session public:", err);
  } finally {
    isLoading.value = false;
  }
};

// Watch for sessionId changes and make session public
watch(
  () => props.sessionId,
  async (newSessionId) => {
    if (newSessionId && props.showDialog) {
      if (props.isPublic) {
        publicLink.value = `${window.location.origin}/share/${newSessionId}`;
        return;
      }
      isLoading.value = true;
      error.value = "";
      publicLink.value = "";

      try {
        const result = await props.onMakePublic(newSessionId);
        if (result.success) {
          publicLink.value = `${window.location.origin}/share/${newSessionId}`;
        } else {
          error.value = result.error || "Failed to create public link";
        }
      } catch (err) {
        error.value = "Failed to create public link";
        console.error("Error making session public:", err);
      } finally {
        isLoading.value = false;
      }
    }
  },
  { immediate: true },
);

// Re-run initialization whenever the modal is opened
watch(
  () => props.showDialog,
  async (isOpen) => {
    if (isOpen) {
      await initializeShare(props.sessionId);
    }
  },
);
</script>

<style scoped>
.vdb-c-bg-black-64 {
  background-color: rgba(0, 0, 0, 0.64);
}
</style>
