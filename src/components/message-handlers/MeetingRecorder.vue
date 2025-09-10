<template>
  <div
    class="vdb-c-flex vdb-c-w-fit vdb-c-flex-col vdb-c-items-end vdb-c-gap-30"
  >
    <!-- Gray parent container -->
    <section
      class="vdb-c-flex vdb-c-flex-col vdb-c-items-end vdb-c-justify-end vdb-c-rounded-[20px] vdb-c-border vdb-c-p-20"
      :style="{
        borderColor: 'var(--Roy, #EFEFEF)',
        background: 'var(--Light-Grey-VDB, #F7F7F7)',
      }"
      :class="!isOpen ? 'vdb-c-gap-0' : 'vdb-c-gap-30'"
    >
      <!-- Header / Toggle (title + chevron) -->
      <button
        type="button"
        class="vdb-c-flex vdb-c-w-full vdb-c-items-center vdb-c-justify-between"
        @click="isOpen = !isOpen"
        :aria-expanded="isOpen ? 'true' : 'false'"
      >
        <span class="vdb-c-text-[18px] vdb-c-font-[600] vdb-c-text-black">
          Set Up Meeting Assistant Context
        </span>
        <ChevronDown
          class="vdb-c-h-[20px] vdb-c-w-[20px] vdb-c-transition-transform vdb-c-duration-200"
          :class="isOpen ? 'vdb-c-rotate-180' : ''"
        />
      </button>

      <!-- Main questions menu -->
      <div
        class="vdb-c-w-full vdb-c-overflow-hidden vdb-c-transition-all vdb-c-duration-300"
        :class="
          isOpen
            ? 'vdb-c-max-h-[5000px] vdb-c-opacity-100'
            : 'vdb-c-max-h-0 vdb-c-opacity-0'
        "
      >
        <div
          class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-start vdb-c-gap-24"
        >
          <!-- Q1: Main goal -->
          <div
            class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-start vdb-c-gap-16 vdb-c-p-4"
          >
            <label
              class="vdb-c-w-full vdb-c-text-[16px] vdb-c-font-[500] vdb-c-text-black"
            >
              What is the main goal of this meeting?
            </label>

            <div class="vdb-c-flex vdb-c-flex-wrap vdb-c-gap-16">
              <button
                v-for="g in mainGoals"
                :key="g"
                type="button"
                @click="toggleMainGoal(g)"
                class="vdb-c-flex vdb-c-h-[44px] vdb-c-items-center vdb-c-gap-16 vdb-c-rounded-[10px] vdb-c-border vdb-c-px-16 vdb-c-py-10 vdb-c-transition-colors vdb-c-duration-150"
                :class="
                  selectedMainGoals.has(g)
                    ? 'vdb-c-border-[#EC5B16] vdb-c-bg-[#FFF5EC]'
                    : 'vdb-c-border-[#EFEFEF] vdb-c-bg-white hover:vdb-c-border-[rgba(150,150,150,0.5)]'
                "
              >
                <!-- square checkbox -->
                <span
                  class="vdb-c-flex vdb-c-h-[16px] vdb-c-w-[16px] vdb-c-items-center vdb-c-justify-center vdb-c-rounded-4 vdb-c-border"
                  :class="
                    selectedMainGoals.has(g)
                      ? 'vdb-c-border-[#EC5B16] vdb-c-bg-[#EC5B16]'
                      : 'vdb-c-border-[#969696] vdb-c-bg-white'
                  "
                >
                  <svg
                    v-if="selectedMainGoals.has(g)"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6 12l4 4 8-8"
                      stroke="#FFFFFF"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>

                <span
                  class="vdb-c-text-[14px] vdb-c-font-[500] vdb-c-leading-[24px] vdb-c-tracking-[0.07px] vdb-c-text-black"
                >
                  {{ g }}
                </span>
              </button>
            </div>
          </div>

          <!-- Q2: Objectives (input) -->
          <div
            class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-start vdb-c-gap-16 vdb-c-p-4"
          >
            <label
              class="vdb-c-w-full vdb-c-text-[16px] vdb-c-font-[500] vdb-c-text-black"
            >
              What are the main objectives of this meeting
            </label>
            <input
              v-model="objective"
              type="text"
              placeholder="Review Q4 performance"
              class="vdb-c-w-full vdb-c-rounded-8 vdb-c-border vdb-c-px-16 vdb-c-py-14 vdb-c-text-[14px] vdb-c-text-black placeholder:vdb-c-text-[#9CA3AF] hover:vdb-c-border-[#969696] hover:vdb-c-bg-white focus:vdb-c-border-[#EC5B16] focus:vdb-c-bg-white focus:vdb-c-shadow-[0_0_0_3px_rgba(236,91,22,0.25)] focus:vdb-c-outline-none"
              :class="
                objective
                  ? 'vdb-c-border-[#EFEFEF] vdb-c-bg-white'
                  : 'vdb-c-border-[#EFEFEF] vdb-c-bg-[#F7F7F7]'
              "
            />
          </div>

          <!-- Q3: Topics -->
          <div
            class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-start vdb-c-gap-16 vdb-c-p-4"
          >
            <label class="vdb-c-text-[16px] vdb-c-font-[500] vdb-c-text-black"
              >Expected discussion topics</label
            >

            <!-- Choice chips -->
            <div class="vdb-c-flex vdb-c-w-full vdb-c-flex-wrap vdb-c-gap-16">
              <button
                v-for="t in topicOptions"
                :key="t"
                type="button"
                @click="toggleTopic(t)"
                class="vdb-c-inline-flex vdb-c-items-center vdb-c-gap-1 vdb-c-rounded-[999px] vdb-c-border vdb-c-p-6 vdb-c-transition"
                :class="
                  selectedTopics.has(t)
                    ? 'vdb-c-border-[#EC5B16] vdb-c-bg-[#FFE9D3]'
                    : 'vdb-c-border-roy vdb-c-bg-white hover:vdb-c-border-[rgba(150,150,150,0.5)]'
                "
              >
                <span
                  class="vdb-c-px-4 vdb-c-text-[14px] vdb-c-font-[500] vdb-c-leading-[24px] vdb-c-tracking-[0.07px] vdb-c-text-black"
                >
                  {{ t }}
                </span>

                <!-- orange close dot when selected -->
                <span
                  v-if="selectedTopics.has(t)"
                  class="vdb-c-ml-8 vdb-c-flex vdb-c-h-[15px] vdb-c-w-[15px] vdb-c-items-center vdb-c-justify-center vdb-c-rounded-full vdb-c-bg-[#EC5B16]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="9"
                    height="8"
                    viewBox="0 0 9 8"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.42732 1.07345C7.4506 1.09667 7.46907 1.12426 7.48167 1.15463C7.49428 1.185 7.50076 1.21756 7.50076 1.25045C7.50076 1.28333 7.49428 1.31589 7.48167 1.34626C7.46907 1.37664 7.4506 1.40422 7.42732 1.42745L1.92732 6.92745C1.88037 6.97439 1.8167 7.00076 1.75032 7.00076C1.68393 7.00076 1.62026 6.97439 1.57332 6.92745C1.52637 6.8805 1.5 6.81683 1.5 6.75045C1.5 6.68406 1.52637 6.62039 1.57332 6.57345L7.07332 1.07345C7.09654 1.05017 7.12413 1.03169 7.1545 1.01909C7.18487 1.00649 7.21743 1 7.25032 1C7.2832 1 7.31576 1.00649 7.34613 1.01909C7.3765 1.03169 7.40409 1.05017 7.42732 1.07345Z"
                      fill="#F7F7F7"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1.57345 1.07345C1.55017 1.09667 1.53169 1.12426 1.51909 1.15463C1.50649 1.185 1.5 1.21756 1.5 1.25045C1.5 1.28333 1.50649 1.31589 1.51909 1.34626C1.53169 1.37664 1.55017 1.40422 1.57345 1.42745L7.07345 6.92745C7.12039 6.97439 7.18406 7.00076 7.25045 7.00076C7.31683 7.00076 7.3805 6.97439 7.42745 6.92745C7.47439 6.8805 7.50076 6.81683 7.50076 6.75045C7.50076 6.68406 7.47439 6.62039 7.42745 6.57345L1.92745 1.07345C1.90422 1.05017 1.87664 1.03169 1.84626 1.01909C1.81589 1.00649 1.78333 1 1.75045 1C1.71756 1 1.685 1.00649 1.65463 1.01909C1.62426 1.03169 1.59667 1.05017 1.57345 1.07345Z"
                      fill="#F7F7F7"
                    />
                  </svg>
                </span>
              </button>
            </div>

            <!-- Freeform topics input (same input style as Q2) -->
            <input
              v-model="discussionTopicText"
              type="text"
              placeholder="Client data, Client revenue"
              class="vdb-c-w-full vdb-c-rounded-8 vdb-c-border vdb-c-px-16 vdb-c-py-14 vdb-c-text-[14px] vdb-c-text-black placeholder:vdb-c-text-[#9CA3AF] hover:vdb-c-border-[#969696] hover:vdb-c-bg-white focus:vdb-c-border-[#EC5B16] focus:vdb-c-bg-white focus:vdb-c-shadow-[0_0_0_3px_rgba(236,91,22,0.25)] focus:vdb-c-outline-none"
              :class="
                discussionTopicText
                  ? 'vdb-c-border-[#EFEFEF] vdb-c-bg-white'
                  : 'vdb-c-border-[#EFEFEF] vdb-c-bg-[#F7F7F7]'
              "
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Save (only visible when open) -->
    <button
      v-if="isOpen"
      :disabled="!canSave"
      class="vdb-c-flex vdb-c-w-fit vdb-c-items-center vdb-c-justify-center vdb-c-gap-10 vdb-c-rounded-8 vdb-c-px-16 vdb-c-py-12 vdb-c-transition-colors"
      @click="handleSave"
      :class="
        canSave
          ? 'vdb-c-cursor-pointer vdb-c-bg-[#EC5B16] hover:vdb-c-bg-[#FF7E32]'
          : 'vdb-c-cursor-not-allowed vdb-c-bg-[#969696]'
      "
    >
      <span
        class="vdb-c-text-[14px] vdb-c-font-[600] vdb-c-leading-[16px] vdb-c-text-[#FFF]"
        >Save</span
      >
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useVideoDBChat } from "../../context.js";
import ChevronDown from "../icons/ChevronDown.vue";

const props = defineProps({
  content: { type: Object, required: true },
  isLastConv: { type: Boolean, default: false },
  isUser: { type: Boolean, default: false },
  searchTerm: { type: String, default: "" },
  convId: { type: String, default: "" },
  msgId: { type: String, default: "" },
});

const isOpen = ref(true);

/* Initial state MUST be empty */
const mainGoals = [
  "Review Performance",
  "Strategic Planning",
  "Daily Standup",
  "Client meeting",
  "Demo Showcase",
  "Other",
];
const selectedMainGoals = ref(new Set()); // empty
const objective = ref(""); // empty
const topicOptions = [
  "Budget Planning",
  "Team Performance",
  "Project timeline",
  "Market analysis",
  "Risk assessment",
  "Customer feedback",
  "Resource allocation",
];
const selectedTopics = ref(new Set()); // empty
const discussionTopicText = ref(""); // empty

function toggleMainGoal(goal) {
  const set = new Set(selectedMainGoals.value);
  set.has(goal) ? set.delete(goal) : set.add(goal);
  selectedMainGoals.value = set;
}
function toggleTopic(t) {
  const set = new Set(selectedTopics.value);
  set.has(t) ? set.delete(t) : set.add(t);
  selectedTopics.value = set;
}

const canSave = computed(
  () =>
    selectedMainGoals.value.size > 0 ||
    objective.value.trim().length > 0 ||
    selectedTopics.value.size > 0 ||
    discussionTopicText.value.trim().length > 0,
);

/* chat ctx */
const { saveMeetingContext, fetchMeetingContext, openCanvas, canvasState } =
  useVideoDBChat();

onMounted(async () => {
  openCanvas && openCanvas("meeting_recorder", props.content);
  if (props.content?.ui_id) {
    const res = await fetchMeetingContext(props.content.ui_id);
    if (res.status === "success" && res.data) {
      const ctx = res.data?.meeting_context;
      if (!ctx) return;
      if (Array.isArray(ctx.main_goals))
        selectedMainGoals.value = new Set(ctx.main_goals);
      if (typeof ctx.objective === "string") objective.value = ctx.objective;
      if (Array.isArray(ctx.topics)) selectedTopics.value = new Set(ctx.topics);
      if (typeof ctx.discussion_topic_text === "string")
        discussionTopicText.value = ctx.discussion_topic_text;
      isOpen.value = false;
    }
  }
});

/* Populate from content / metadata if provided later */
watch(
  () => props.content,
  (c) => {
    if (canvasState.show && canvasState.type === "meeting_recorder") {
      canvasState.content = c;
    }
  },
  { deep: true, immediate: true },
);

async function handleSave() {
  if (!canSave.value) return;

  const meetingContext = {
    main_goals: Array.from(selectedMainGoals.value),
    objective: objective.value.trim(),
    topics: Array.from(selectedTopics.value),
    discussion_topic_text: discussionTopicText.value.trim(),
    ui_id: props.content.ui_id,
  };

  const targetMsgId = props.content?.msg_id || props.msgId;
  saveMeetingContext(targetMsgId, meetingContext);
  openCanvas && openCanvas("meeting_recorder", props.content);

  // 2) Auto-close the drawer
  isOpen.value = false;
}
</script>

<style scoped>
button:focus-visible {
  outline: 2px solid rgba(0, 0, 0, 0.15);
  outline-offset: 2px;
}
</style>
