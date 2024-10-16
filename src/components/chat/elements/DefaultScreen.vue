<template>
  <div
    class="vdb-c-flex vdb-c-h-full vdb-c-w-5/6 vdb-c-flex-col vdb-c-gap-32 vdb-c-p-32"
  >
    <div class="vdb-c-flex vdb-c-flex-col vdb-c-gap-8">
      <h1
        class="vdb-c-flex vdb-c-items-center vdb-c-gap-4 vdb-c-text-5xl vdb-c-leading-tight"
      >
        <span
          v-if="collectionName"
          class="vdb-c-inline-block vdb-c-max-w-[60%] vdb-c-truncate vdb-c-font-extrabold"
          style="
            background-image: radial-gradient(circle, #ff7e32, #ff5b0a);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          "
          :title="collectionName"
        >
          {{ collectionName }}
        </span>
        <span
          v-else
          class="vdb-c-inline-block vdb-c-h-[3rem] vdb-c-w-4/6 vdb-c-animate-pulse vdb-c-rounded vdb-c-bg-roy"
        ></span>
      </h1>
      <transition name="fade" mode="out-in">
        <div
          v-if="isOnboardingMessageVisible"
          class="fade-in-anim vdb-c-relative vdb-c-rounded-lg vdb-c-bg-vdb-lightgrey vdb-c-p-20"
        >
          <div
            class="vdb-c-absolute vdb-c-right-8 vdb-c-top-10 vdb-c-cursor-pointer vdb-c-p-10 hover:vdb-c-bg-roy"
            @click="hideOnboardingMessage"
          >
            <CrossIcon />
          </div>
          <div
            class="vdb-c-flex vdb-c-w-5/6 vdb-c-flex-col vdb-c-gap-6 vdb-c-text-pam"
          >
            <div class="vdb-c-font-semibold">
              Welcome to Spielberg: a video-first AI agent framework powered by
              <a
                href="https://www.videodb.io"
                target="_blank"
                class="vdb-c-font-semibold vdb-c-text-pam vdb-c-underline"
              >
                VideoDB </a
              >.
            </div>
            <div>
              Feel free to explore our agents, or
              <a
                href="https://www.videodb.io"
                target="_blank"
                class="vdb-c-font-semibold vdb-c-text-pam vdb-c-underline"
              >
                create a custom agent
              </a>
              that suits your workflows. From upload to publish - Spielberg can
              get it all done right here! Let us know how you like it on our
              <a
                href="https://discord.com/invite/py9P639jGz"
                target="_blank"
                class="vdb-c-font-semibold vdb-c-text-pam vdb-c-underline"
              >
                Discord.
              </a>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- Action Cards -->
    <div
      class="fade-in-anim vdb-c-flex vdb-c-grow vdb-c-items-start vdb-c-justify-center vdb-c-pt-4"
    >
      <div
        class="vdb-c-grid vdb-c-grid-cols-2 vdb-c-gap-16 md:vdb-c-grid-cols-4 2xl:vdb-c-grid-cols-5"
      >
        <div
          v-for="(query, index) in actionCardQueries"
          :key="index"
          :class="[
            'vdb-c-w-160 vdb-c-h-120 hover:vdb-c-shadow-md vdb-c-flex vdb-c-cursor-pointer vdb-c-flex-col vdb-c-gap-24 vdb-c-rounded-lg vdb-c-border vdb-c-px-16 vdb-c-py-20 vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out md:vdb-c-h-240',
            {
              'vdb-c-bg-orange-50 hover:vdb-c-bg-orange-100':
                query.type === 'primary',
              'vdb-c-border-roy vdb-c-bg-vdb-lightgrey hover:vdb-c-bg-roy':
                query.type === 'muted',
              'vdb-c-bg-vdb-orange hover:vdb-c-bg-[#D45214]':
                query.type === 'cta',
            },
          ]"
          @click="$emit('query-card-click', query)"
        >
          <div
            :class="[
              'vdb-c-hidden vdb-c-h-48 vdb-c-w-48 vdb-c-items-center vdb-c-justify-center vdb-c-self-start vdb-c-rounded-full vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out md:vdb-c-flex',
              {
                'vdb-c-bg-[#B92600A6]': query.type === 'cta',
                'vdb-c-bg-roy': query.type === 'muted',
                'vdb-c-bg-orange-100': query.type === 'primary',
              },
            ]"
          >
            <component v-if="query.icon" :is="query.icon"> </component>
            <QuestionMark
              v-else
              :fill="
                query.type === 'cta'
                  ? '#FFFFFF'
                  : query.type === 'muted'
                    ? '#2D2D2D'
                    : '#C14103'
              "
            />
          </div>
          <p
            class="vdb-c-flex-grow vdb-c-text-left vdb-c-text-sm vdb-c-font-semibold lg:vdb-c-text-base"
            :class="[
              {
                'vdb-c-text-pam': query.type === 'muted',
                'vdb-c-text-kilvish-900': query.type === 'primary',
                'vdb-c-text-orange-50': query.type === 'cta',
              },
            ]"
          >
            <component v-if="query.component" :is="query.component"></component>
            <span v-else> {{ query.content }} </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Try asking an agent -->
    <div
      class="vdb-c-flex vdb-c-min-h-0 vdb-c-flex-grow vdb-c-flex-col vdb-c-gap-16"
    >
      <div class="vdb-c-flex vdb-c-items-center vdb-c-justify-between">
        <h3
          class="vdb-c-text-2xl vdb-c-font-semibold vdb-c-text-vdb-darkishgrey"
        >
          Try asking an agent
        </h3>
        <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-16">
          <button
            class="vdb-c-flex vdb-c-flex-row vdb-c-items-center vdb-c-gap-6 vdb-c-text-sm vdb-c-font-medium vdb-c-text-pam"
          >
            <div
              class="vdb-c-flex vdb-c-h-16 vdb-c-w-16 vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-bg-[#12131A40]"
            >
              <InfoIcon />
            </div>
            <span>Create custom agents</span>
          </button>

          <Button variant="secondary" @click="$emit('explore-agents-click')">
            <div
              class="vdb-c-flex vdb-c-items-center vdb-c-gap-6 vdb-c-font-normal"
            >
              <span> Explore agents </span>
              <MenuIcon />
            </div>
          </Button>
        </div>
      </div>
      <div
        class="vdb-c-grid vdb-c-grid-cols-1 vdb-c-content-start vdb-c-gap-16 vdb-c-overflow-y-auto lg:vdb-c-grid-cols-2"
      >
        <div
          v-for="(agent, index) in allAgents.slice(0, 2)"
          :key="index"
          class="vdb-c-flex vdb-c-cursor-pointer vdb-c-items-center vdb-c-rounded-lg vdb-c-border-2 vdb-c-border-roy hover:vdb-c-bg-gray-100"
          @click="$emit('agent-click', agent)"
        >
          <div
            class="flex items-center justify-center vdb-c-rounded-full vdb-c-px-20 vdb-c-py-24"
          >
            <div
              class="vdb-c-flex vdb-c-h-34 vdb-c-w-34 vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-bg-orange-100"
            >
              <AtIcon />
            </div>
          </div>
          <div
            class="vdb-c-flex vdb-c-flex-col vdb-c-gap-4 vdb-c-border-l vdb-c-border-roy vdb-c-px-16 vdb-c-py-10"
          >
            <h4 class="vdb-c-font-semibold vdb-c-text-kilvish-900">
              <span
                class="vdb-c-text-kivlish-900 vdb-c-text-base vdb-c-font-bold sm:vdb-c-text-lg"
                >{{ agent.name }}</span
              >
            </h4>
            <p class="vdb-c-text-sm vdb-c-text-vdb-darkishgrey">
              <span
                class="vdb-c-line-clamp-2 vdb-c-min-h-[2.5em] vdb-c-text-xs vdb-c-font-normal vdb-c-text-vdb-darkishgrey sm:vdb-c-text-sm"
                >{{ agent.description }}</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import Button from "../../buttons/Button.vue";

import QuestionMark from "../../icons/QuestionMark.vue";
import FileUploadIcon from "../../icons/FileUpload.vue";
import InfoIcon from "../../icons/Info.vue";
import CrossIcon from "../../icons/Cross.vue";
import AtIcon from "../../icons/AtIcon.vue";
import MenuIcon from "../../icons/Menu.vue";

const props = defineProps({
  userName: {
    type: String,
    required: true,
    default: "",
  },
  allAgents: {
    type: Array,
    default: () => [],
  },
  activeCollectionData: {
    type: Object,
    default: () => null,
  },
  actionCardQueries: {
    type: Array,
    default: () => [],
  },
  showOnboardingMessage: {
    type: Boolean,
    default: true,
  },
});

const collectionName = computed(() => props.activeCollectionData?.name);
const isOnboardingMessageVisible = ref(false);

watch(
  () => props.showOnboardingMessage,
  (val) => {
    isOnboardingMessageVisible.value = val;
  },
  { immediate: true },
);

const hideOnboardingMessage = () => {
  isOnboardingMessageVisible.value = false;
};

defineEmits(["query-card-click", "agent-click", "explore-agents-click"]);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-in-anim {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
