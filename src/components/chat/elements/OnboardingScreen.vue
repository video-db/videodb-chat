<template>
  <div
    class="vdb-c-flex vdb-c-h-full vdb-c-w-5/6 vdb-c-flex-col vdb-c-gap-32 vdb-c-p-32"
  >
    <div class="vdb-c-flex vdb-c-flex-col vdb-c-gap-8">
      <h1
        class="vdb-c-text-5xl vdb-c-font-extrabold vdb-c-leading-tight"
        style="
          background-image: radial-gradient(circle, #ff7e32, #ff5b0a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        "
      >
        Hello{{ userName }}
      </h1>
      <h2 class="vdb-c-text-4xl vdb-c-font-semibold vdb-c-text-[#1E1E1E]">
        How can Spielberg help you today?
      </h2>
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
            'vdb-c-w-160 vdb-c-h-120 vdb-c-flex vdb-c-cursor-pointer vdb-c-flex-col vdb-c-gap-24 vdb-c-rounded-lg vdb-c-px-16 vdb-c-py-20 vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out md:vdb-c-h-240',
            query.muted
              ? 'hover:vdb-c-shadow-md vdb-c-border vdb-c-border-[#EFEFEF] vdb-c-bg-[#F7F7F7] hover:vdb-c-bg-[#E5E5E5]'
              : 'hover:vdb-c-shadow-md vdb-c-bg-[#FFF5EC] hover:vdb-c-bg-[#FFE9D3]',
          ]"
          @click="$emit('query-card-click', query)"
        >
          <div
            :class="[
              'vdb-c-hidden vdb-c-h-48 vdb-c-w-48 vdb-c-items-center vdb-c-justify-center vdb-c-self-start vdb-c-rounded-full vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in-out md:vdb-c-flex',
              query.muted ? 'vdb-c-bg-[#EFEFEF]' : 'vdb-c-bg-[#FFE9D3]',
            ]"
          >
            <QuestionMark :fill="query.muted ? '#2D2D2D' : '#C14103'" />
          </div>
          <p
            class="vdb-c-flex-grow vdb-c-text-left vdb-c-text-sm vdb-c-font-semibold vdb-c-text-[#1D2736] lg:vdb-c-text-base"
          >
            {{ query.text }}
          </p>
        </div>
      </div>
    </div>

    <!-- Try asking an agent -->
    <div
      class="vdb-c-flex vdb-c-min-h-0 vdb-c-flex-grow vdb-c-flex-col vdb-c-gap-16"
    >
      <div class="vdb-c-flex vdb-c-items-center vdb-c-justify-between">
        <h3 class="vdb-c-text-2xl vdb-c-font-semibold vdb-c-text-[#1E1E1E]">
          Try asking an agent
        </h3>
        <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-16">
          <button
            class="vdb-c-flex vdb-c-flex-row vdb-c-items-center vdb-c-gap-6 vdb-c-text-sm vdb-c-font-medium vdb-c-text-[#464646]"
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
          class="vdb-c-flex vdb-c-cursor-pointer vdb-c-items-center vdb-c-rounded-lg vdb-c-border-2 vdb-c-border-[#EFEFEF] hover:vdb-c-bg-[#FAFAFA]"
          @click="$emit('agent-click', agent)"
        >
          <div
            class="flex items-center justify-center vdb-c-rounded-full vdb-c-px-20 vdb-c-py-24"
          >
            <div
              class="vdb-c-flex vdb-c-h-34 vdb-c-w-34 vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-bg-[#FFE9D3]"
            >
              <AtIcon />
            </div>
          </div>
          <div
            class="vdb-c-flex vdb-c-flex-col vdb-c-gap-4 vdb-c-border-l vdb-c-border-[#EFEFEF] vdb-c-px-16 vdb-c-py-10"
          >
            <h4 class="vdb-c-font-semibold vdb-c-text-[#1D2736]">
              <span
                class="vdb-c-text-base vdb-c-font-bold vdb-c-text-[#1D2736] sm:vdb-c-text-lg"
                >{{ agent.name }}</span
              >
            </h4>
            <p class="vdb-c-text-sm vdb-c-text-[#1E1E1E]">
              <span
                class="vdb-c-text-xs vdb-c-font-normal vdb-c-text-[#1E1E1E] sm:vdb-c-text-sm vdb-c-line-clamp-2"
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
import QuestionMark from "../../icons/QuestionMark.vue";
import InfoIcon from "../../icons/InfoIcon.vue";
import AtIcon from "../../icons/AtIcon.vue";
import MenuIcon from "../../icons/MenuIcon.vue";
import Button from "../../buttons/Button.vue";

defineProps({
  userName: {
    type: String,
    required: true,
    default: "",
  },
  allAgents: {
    type: Array,
    default: () => [],
  },
  actionCardQueries: {
    type: Array,
    default: () => [
      {
        text: "Show me all the videos in my collection",
        muted: false,
        action: "show-collection",
      },
      {
        text: "Upload a video to my default collection",
        muted: false,
        action: "chat",
      },
      {
        text: "Categorise the videos in my collection by size",
        muted: false,
        action: "chat",
      },
      {
        text: "I'm not sure. Help me figure out what you can do.",
        muted: true,
        action: "chat",
      },
    ],
  },
});

defineEmits(["query-card-click", "agent-click", "explore-agents-click"]);
</script>

<style scoped>
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
