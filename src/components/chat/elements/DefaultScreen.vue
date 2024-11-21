<template>
  <div
    class="vdb-c-flex vdb-c-h-full vdb-c-w-5/6 vdb-c-flex-col vdb-c-gap-32 vdb-c-p-32"
  >
    <div class="vdb-c-flex vdb-c-flex-col vdb-c-gap-8">
      <h1
        class="vdb-c-flex vdb-c-items-center vdb-c-gap-4 vdb-c-text-xl vdb-c-leading-tight sm:vdb-c-text-3xl md:vdb-c-text-5xl"
        :style="{ lineHeight: '1.2' }"
      >
        <span
          v-if="collectionName"
          class="vdb-c-inline-block vdb-c-max-w-[80%] vdb-c-truncate vdb-c-font-extrabold"
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
            <div class="vdb-c-font-semibold">🎉 Welcome to The Director!</div>
            <div>
              Your AI-powered agent framework, built on
              <a
                href="https://www.videodb.io"
                target="_blank"
                class="vdb-c-font-semibold vdb-c-text-pam vdb-c-underline"
              >
                VideoDB,
              </a>
              is ready to revolutionize how you work with videos and audio.
            </div>
            <div>
              Explore pre-built agents or
              <a
                href="https://github.com/video-db/Director?tab=readme-ov-file#-creating-a-new-agent"
                target="_blank"
                class="vdb-c-font-semibold vdb-c-text-pam vdb-c-underline"
              >
                create custom ones
              </a>
              tailored to your workflows. From upload to publish, The Director
              handles it all—quickly and effortlessly.
            </div>
            <div>
              We'd love to hear your thoughts! Join our community and share your
              experience on
              <a
                href="https://discord.com/invite/py9P639jGz"
                target="_blank"
                class="vdb-c-font-semibold vdb-c-text-pam vdb-c-underline"
              >
                Discord </a
              >.
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
        class="vdb-c-grid vdb-c-grid-cols-2 vdb-c-gap-16 md:vdb-c-grid-cols-4 2xl:vdb-c-grid-cols-4"
      >
        <div
          v-for="(query, index) in actionCardQueries"
          :key="index"
          :class="[
            'vdb-c-w-160 vdb-c-h-120 hover:vdb-c-shadow-md vdb-c-relative vdb-c-flex vdb-c-cursor-pointer vdb-c-flex-col vdb-c-gap-24 vdb-c-rounded-lg vdb-c-border vdb-c-px-16 vdb-c-py-20 vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out md:vdb-c-h-240',
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
            v-if="query.isDemo"
            class="vdb-c-absolute vdb-c-right-12 vdb-c-flex vdb-c-flex-row vdb-c-items-center vdb-c-rounded-4 vdb-c-bg-orange-900 vdb-c-px-6 vdb-c-py-3 vdb-c-text-xs vdb-c-font-semibold vdb-c-uppercase vdb-c-text-white"
          >
            <span> <StarIcon /> </span>
            <span class="vdb-c-ml-4"> DEMO </span>
          </div>
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
            <span v-else class="vdb-c-break-words"> {{ query.content }} </span>
          </p>
        </div>
      </div>
    </div>

    <div class="vdb-c-flex vdb-c-flex-col vdb-c-gap-12">
      <div
        class="vdb-c-mt-12 vdb-c-h-1 vdb-c-w-full vdb-c-bg-[#EFEFEF]"
        v-if="!showDemoVideos"
      ></div>
      <div class="vdb-c-text-xl vdb-c-font-normal vdb-c-text-vdb-darkishgrey">
        <div v-if="showDemoVideos">
          <div
            class="vdb-c-flex vdb-c-items-center vdb-c-justify-between vdb-c-gap-4"
          >
            <span class="vdb-c-font-semibold">
              Here's how you can use Director:
            </span>
            <Button variant="secondary">
              <div
                class="vdb-c-flex vdb-c-items-center vdb-c-justify-between vdb-c-gap-6"
                @click="
                  $emit(
                    'view-all-videos-click',
                    'https://www.youtube.com/playlist?list=PLhxAMFLSSK039xl1UgcZmoFLnb-qNRYQw',
                  )
                "
              >
                <div class="vdb-c-text-sm vdb-c-font-medium">
                  Watch more demos
                </div>
                <ExternalLinkIcon />
              </div>
            </Button>
          </div>
        </div>
        <div v-else>
          <div
            v-if="collectionName"
            class="vdb-c-flex vdb-c-items-center vdb-c-justify-between vdb-c-gap-4"
          >
            <span> <b> Videos </b> in {{ collectionName }} </span>
            <Button variant="secondary" @click="$emit('view-all-videos-click')">
              <div
                class="vdb-c-flex vdb-c-items-center vdb-c-justify-between vdb-c-gap-6"
              >
                <div class="vdb-c-text-sm vdb-c-font-medium">View all</div>
                <ChevronRightCircled />
              </div>
            </Button>
          </div>
          <div v-else>
            <div
              class="vdb-c-inline-block vdb-c-h-[3rem] vdb-c-w-full vdb-c-animate-pulse vdb-c-rounded vdb-c-bg-roy"
            ></div>
          </div>
        </div>
      </div>
      <div
        v-if="previewVideos"
        class="vdb-c-mb-24 vdb-c-grid vdb-c-grid-cols-12 vdb-c-gap-24 sm:vdb-c-mb-32 sm:vdb-c-gap-32"
      >
        <div
          v-for="(item, index) in previewVideos"
          :key="`post-${item.id}`"
          class="vdb-c-col-span-12 sm:vdb-c-col-span-6 md:vdb-c-col-span-4 lg:vdb-c-col-span-3"
        >
          <video-card
            border-class="sm:vdb-c-hidden"
            :item="item"
            :border-b="true"
            :index="index"
            :variant="showDemoVideos ? 'hide-title' : 'default'"
            @video-click="$emit('video-click', item)"
          />
        </div>
      </div>
      <div
        v-else
        class="vdb-c-mb-24 vdb-c-grid vdb-c-grid-cols-12 vdb-c-gap-24 sm:vdb-c-mb-32 sm:vdb-c-gap-32"
      >
        <div
          v-for="(item, index) in [1, 2, 3, 4]"
          :key="`post-loading-${index}`"
          class="vdb-c-col-span-12 sm:vdb-c-col-span-6 md:vdb-c-col-span-4 lg:vdb-c-col-span-3"
        >
          <video-card-loader :index="index" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import VideoCard from "../../collection/VideoCard.vue";
import VideoCardLoader from "../../collection/VideoCardLoader.vue";

import Button from "../../buttons/Button.vue";

import QuestionMark from "../../icons/QuestionMark.vue";
import ChevronRightCircled from "../../icons/ChevronRightCircled.vue";
import ExternalLinkIcon from "../../icons/ExternalLink.vue";
import CrossIcon from "../../icons/Cross.vue";
import StarIcon from "../../icons/Star.vue";

const props = defineProps({
  agents: {
    type: Array,
    default: () => [],
  },
  actionCardQueries: {
    type: Array,
    default: () => [],
  },
  showOnboardingMessage: {
    type: Boolean,
    default: true,
  },
  showDemoVideos: {
    type: Boolean,
    default: true,
  },
  previewVideos: {
    type: Array,
    default: null,
  },
  collectionData: {
    type: Object,
    default: () => null,
  },
  collectionVideos: {
    type: Array,
    default: null,
  },
});

const collectionName = computed(() => props.collectionData?.name);
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

defineEmits([
  "query-card-click",
  "agent-click",
  "explore-agents-click",
  "video-click",
  "view-all-videos-click",
]);
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
