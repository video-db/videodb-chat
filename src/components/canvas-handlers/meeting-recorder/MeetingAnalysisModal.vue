<template>
  <div
    v-if="isOpen"
    ref="modalRef"
    class="vdb-c-max-h-[80%] vdb-c-select-none vdb-c-border vdb-c-border-[#E5E7EB] vdb-c-bg-[#FFFFFF]"
    :class="
      isFloating
        ? 'vdb-c-absolute vdb-c-z-10 vdb-c-overflow-hidden vdb-c-rounded-12 vdb-c-shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
        : 'vdb-c-rounded-0 vdb-c-relative vdb-c-w-full'
    "
    :style="isFloating ? modalStyle : {}"
    role="dialog"
    aria-modal="true"
    aria-label="Meeting Assistant"
  >
    <!-- Shell -->
    <div
      class="scrollbar-hide vdb-c-flex vdb-c-h-full vdb-c-flex-col vdb-c-items-start vdb-c-overflow-hidden vdb-c-pb-24 vdb-c-transition-all vdb-c-duration-300"
      :class="isFloating ? 'vdb-c-rounded-12' : 'vdb-c-rounded-0'"
    >
      <!-- Header -->
      <div
        class="vdb-c-flex vdb-c-w-full vdb-c-cursor-move vdb-c-items-center vdb-c-justify-between vdb-c-border-b vdb-c-border-gray-200 vdb-c-bg-[#F7F7F7] vdb-c-px-20 vdb-c-py-12"
        @mousedown="startDrag"
      >
        <div
          class="vdb-c-text-[18px] vdb-c-font-[600] vdb-c-capitalize vdb-c-leading-[27px] vdb-c-text-black"
        >
          Meeting Assistant
        </div>

        <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-8">
          <!-- Pin / Float toggle -->
          <button
            class="vdb-c-grid vdb-c-size-28 vdb-c-place-items-center vdb-c-rounded-8 vdb-c-border vdb-c-transition"
            :aria-pressed="!isFloating ? 'true' : 'false'"
            :title="isFloating ? 'Pin panel' : 'Unpin (float)'"
            @click="$emit('toggle-floating')"
          >
            <!-- Pin icon -->
            <Pinned
              v-if="!isFloating"
              className="vdb-c-text-[#EC5B16]"
              fill="#111827"
            />
            <!-- Unpin icon -->
            <UnPinned v-else className="vdb-c-text-[#111827]" fill="#111827" />
          </button>

          <!-- Close -->
          <button
            class="vdb-c-grid vdb-c-size-28 vdb-c-place-items-center vdb-c-rounded-8 vdb-c-border vdb-c-transition"
            title="Close"
            @click="$emit('close')"
          >
            <Cross className="vdb-c-text-[#111827]" fill="#111827" />
          </button>
        </div>
      </div>

      <!-- Main (scroll area) -->
      <div
        class="scrollbar-hide vdb-c-flex vdb-c-min-h-0 vdb-c-w-full vdb-c-flex-1 vdb-c-flex-col vdb-c-items-start vdb-c-gap-30 vdb-c-overflow-y-auto vdb-c-px-20 vdb-c-py-16"
      >
        <!-- Live Insights -->
        <section
          class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-start vdb-c-gap-20"
        >
          <!-- Label -->
          <div
            class="vdb-c-flex vdb-c-h-[24px] vdb-c-w-full vdb-c-items-center vdb-c-gap-8"
          >
            <!-- placeholder icon -->
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.577C11.4948 21.577 11.0593 21.402 10.6933 21.052C10.3273 20.702 10.1283 20.2744 10.0963 19.7693H13.9038C13.8718 20.2744 13.6728 20.702 13.3068 21.052C12.9408 21.402 12.5052 21.577 12 21.577ZM8.25 18.3845V16.8845H15.75V18.3845H8.25ZM8.40375 15.5C7.35642 14.8487 6.52733 13.9977 5.9165 12.947C5.3055 11.8965 5 10.7475 5 9.5C5 7.55133 5.6795 5.8975 7.0385 4.5385C8.3975 3.1795 10.0513 2.5 12 2.5C13.9487 2.5 15.6025 3.1795 16.9615 4.5385C18.3205 5.8975 19 7.55133 19 9.5C19 10.7475 18.6945 11.8965 18.0835 12.947C17.4727 13.9977 16.6436 14.8487 15.5962 15.5H8.40375ZM8.85 14H15.15C15.9 13.4667 16.4792 12.8083 16.8875 12.025C17.2958 11.2417 17.5 10.4 17.5 9.5C17.5 7.96667 16.9667 6.66667 15.9 5.6C14.8333 4.53333 13.5333 4 12 4C10.4667 4 9.16667 4.53333 8.1 5.6C7.03333 6.66667 6.5 7.96667 6.5 9.5C6.5 10.4 6.70417 11.2417 7.1125 12.025C7.52083 12.8083 8.1 13.4667 8.85 14Z"
                fill="#242424"
              />
            </svg>

            <div
              class="vdb-c-text-[16px] vdb-c-font-[500] vdb-c-leading-[19.6px] vdb-c-text-black"
            >
              Live Insights
            </div>
          </div>

          <!-- Highlights Card -->
          <div
            class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-center vdb-c-justify-center vdb-c-gap-16 vdb-c-rounded-[10px] vdb-c-border vdb-c-border-yellow-200 vdb-c-bg-yellow-50 vdb-c-p-12"
          >
            <div
              class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-start vdb-c-gap-12"
            >
              <div
                class="vdb-c-inline-flex vdb-c-items-center vdb-c-gap-12 vdb-c-rounded-[48px] vdb-c-bg-white vdb-c-px-12 vdb-c-py-8 vdb-c-text-[13px] vdb-c-font-[600] vdb-c-text-black"
              >
                Highlights
              </div>
              <div
                v-if="highlights.length === 0"
                class="vdb-c-text-[13px] vdb-c-text-[#6B7280]"
              >
                No highlights available
              </div>
              <ul
                v-else
                class="scrollbar-hide vdb-c-max-h-[200px] vdb-c-w-full vdb-c-list-disc vdb-c-overflow-auto vdb-c-pl-20"
              >
                <li
                  v-for="(item, idx) in visibleHighlights"
                  :key="'hl-' + idx + '-' + item.text"
                  class="vdb-c-text-[14px] vdb-c-leading-[24px] vdb-c-text-black"
                >
                  {{ normalize(item.text) }}
                </li>
              </ul>
            </div>

            <button
              v-if="highlights.length > 2"
              class="vdb-c-inline-flex vdb-c-items-center vdb-c-gap-1 vdb-c-rounded-[999px] vdb-c-border vdb-c-border-[#EFEFEF] vdb-c-bg-white vdb-c-p-8 vdb-c-text-[13px] vdb-c-font-[500] vdb-c-leading-[16px] vdb-c-tracking-[0.065px] vdb-c-text-black vdb-c-transition hover:vdb-c-bg-[#F9FAFB]"
              @click="toggleSeeAll('highlights')"
            >
              {{ showAllHighlights ? "See less" : "See all" }}
            </button>
          </div>

          <!-- High Priority Card -->
          <div
            class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-center vdb-c-justify-center vdb-c-gap-16 vdb-c-rounded-[10px] vdb-c-border vdb-c-border-[#FFE9D3] vdb-c-bg-[#FFF5EC] vdb-c-p-12"
          >
            <div
              class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-start vdb-c-gap-12"
            >
              <div
                class="vdb-c-inline-flex vdb-c-items-center vdb-c-gap-12 vdb-c-rounded-[48px] vdb-c-bg-white vdb-c-px-12 vdb-c-py-8 vdb-c-text-[13px] vdb-c-font-[600] vdb-c-text-black"
              >
                High Priority
              </div>
              <div
                v-if="highPriority.length === 0"
                class="vdb-c-text-[13px] vdb-c-text-[#6B7280]"
              >
                No high priority insights available
              </div>
              <ul
                v-else
                class="scrollbar-hide vdb-c-max-h-[200px] vdb-c-w-full vdb-c-list-disc vdb-c-overflow-auto vdb-c-pl-20"
              >
                <li
                  v-for="item in visibleHighPriority"
                  :key="item.text"
                  class="vdb-c-text-[14px] vdb-c-leading-[24px] vdb-c-text-black"
                >
                  {{ normalize(item.text) }}
                </li>
              </ul>
            </div>

            <button
              v-if="highPriority.length > 2"
              class="vdb-c-inline-flex vdb-c-items-center vdb-c-gap-1 vdb-c-rounded-[999px] vdb-c-border vdb-c-border-[#EFEFEF] vdb-c-bg-white vdb-c-p-8 vdb-c-text-[13px] vdb-c-font-[500] vdb-c-leading-[16px] vdb-c-tracking-[0.065px] vdb-c-text-black vdb-c-transition hover:vdb-c-bg-[#F9FAFB]"
              @click="toggleSeeAll('high')"
            >
              {{ showAllHigh ? "See less" : "See all" }}
            </button>
          </div>

          <!-- Opportunity Card -->
          <div
            class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-center vdb-c-justify-center vdb-c-gap-16 vdb-c-rounded-[10px] vdb-c-border vdb-c-border-[#EFEFEF] vdb-c-bg-[#F9FAFB] vdb-c-p-12"
          >
            <div
              class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-start vdb-c-gap-12"
            >
              <div
                class="vdb-c-inline-flex vdb-c-items-center vdb-c-gap-12 vdb-c-rounded-[48px] vdb-c-bg-[#EFEFEF] vdb-c-px-12 vdb-c-py-8 vdb-c-text-[13px] vdb-c-font-[600] vdb-c-text-black"
              >
                Opportunity
              </div>

              <div
                v-if="opportunities.length === 0"
                class="vdb-c-text-[13px] vdb-c-text-[#6B7280]"
              >
                No opportunities available
              </div>
              <ul
                v-else
                class="scrollbar-hide vdb-c-max-h-[200px] vdb-c-w-full vdb-c-list-disc vdb-c-overflow-auto vdb-c-pl-20"
              >
                <li
                  v-for="(item, idx) in visibleOpportunities"
                  :key="'op-' + idx + '-' + item.text"
                  class="vdb-c-text-[14px] vdb-c-leading-[24px] vdb-c-text-black"
                >
                  {{ normalize(item.text) }}
                </li>
              </ul>
            </div>

            <button
              v-if="opportunities.length > 2"
              class="vdb-c-inline-flex vdb-c-items-center vdb-c-gap-1 vdb-c-rounded-[999px] vdb-c-border vdb-c-border-[#EFEFEF] vdb-c-bg-white vdb-c-p-8 vdb-c-text-[13px] vdb-c-font-[500] vdb-c-leading-[16px] vdb-c-tracking-[0.065px] vdb-c-text-black vdb-c-transition hover:vdb-c-bg-[#FFFFFF]/70"
              @click="toggleSeeAll('opp')"
            >
              {{ showAllOpp ? "See less" : "See all" }}
            </button>
          </div>
        </section>

        <!-- Suggested Questions / Actions -->
        <section
          class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-start vdb-c-gap-20"
        >
          <div
            class="vdb-c-flex vdb-c-items-center vdb-c-gap-8 vdb-c-text-[16px] vdb-c-font-[500] vdb-c-leading-[19.6px] vdb-c-text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11.989 17.6152C12.2745 17.6152 12.5157 17.5168 12.7125 17.3198C12.9093 17.1226 13.0078 16.8812 13.0078 16.5955C13.0078 16.31 12.9092 16.0688 12.712 15.872C12.5148 15.6753 12.2735 15.577 11.988 15.577C11.7025 15.577 11.4613 15.6756 11.2645 15.8728C11.0677 16.0699 10.9692 16.3112 10.9692 16.5968C10.9692 16.8822 11.0678 17.1234 11.265 17.3203C11.4622 17.5169 11.7035 17.6152 11.989 17.6152ZM11.2808 14.0345H12.6885C12.7013 13.5423 12.7734 13.1491 12.9047 12.8548C13.0363 12.5606 13.3552 12.1706 13.8615 11.6848C14.3013 11.2449 14.6382 10.8388 14.872 10.4663C15.106 10.0939 15.223 9.65417 15.223 9.147C15.223 8.28617 14.9137 7.61375 14.2952 7.12975C13.6766 6.64592 12.9448 6.404 12.1 6.404C11.2653 6.404 10.5747 6.62675 10.028 7.07225C9.48117 7.51775 9.09108 8.04242 8.85775 8.64625L10.1423 9.1615C10.2641 8.8295 10.4724 8.50608 10.7673 8.19125C11.0621 7.87658 11.4999 7.71925 12.0808 7.71925C12.6718 7.71925 13.1086 7.88108 13.3913 8.20475C13.6741 8.52858 13.8155 8.88467 13.8155 9.273C13.8155 9.61283 13.7187 9.92375 13.525 10.2057C13.3315 10.4877 13.0848 10.7602 12.7848 11.023C12.1283 11.6153 11.7135 12.0878 11.5405 12.4405C11.3673 12.793 11.2808 13.3243 11.2808 14.0345ZM12.0017 21.5C10.6877 21.5 9.45267 21.2507 8.2965 20.752C7.14033 20.2533 6.13467 19.5766 5.2795 18.7218C4.42433 17.8669 3.74725 16.8617 3.24825 15.706C2.74942 14.5503 2.5 13.3156 2.5 12.0017C2.5 10.6877 2.74933 9.45267 3.248 8.2965C3.74667 7.14033 4.42342 6.13467 5.27825 5.2795C6.13308 4.42433 7.13833 3.74725 8.294 3.24825C9.44967 2.74942 10.6844 2.5 11.9983 2.5C13.3123 2.5 14.5473 2.74933 15.7035 3.248C16.8597 3.74667 17.8653 4.42342 18.7205 5.27825C19.5757 6.13308 20.2528 7.13833 20.7518 8.294C21.2506 9.44967 21.5 10.6844 21.5 11.9983C21.5 13.3123 21.2507 14.5473 20.752 15.7035C20.2533 16.8597 19.5766 17.8653 18.7218 18.7205C17.8669 19.5757 16.8617 20.2528 15.706 20.7518C14.5503 21.2506 13.3156 21.5 12.0017 21.5ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"
                fill="#242424"
              />
            </svg>
            Suggested Questions/Actions
          </div>

          <div
            v-if="questions.length === 0"
            class="vdb-c-text-[13px] vdb-c-text-[#6B7280]"
          >
            No suggested questions or actions
          </div>
          <TransitionGroup
            v-else
            name="list-fade"
            tag="ul"
            class="scrollbar-hide vdb-c-max-h-[200px] vdb-c-w-full vdb-c-list-disc vdb-c-overflow-auto vdb-c-pl-20"
          >
            <li
              v-for="(q, idx) in questions"
              :key="'q-' + idx + '-' + q.text + '-' + q.answered"
              class="vdb-c-text-[14px] vdb-c-leading-[24px] vdb-c-text-black"
            >
              {{ q.text }}
            </li>
          </TransitionGroup>
        </section>

        <!-- Meeting Checklist -->
        <section
          class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-start vdb-c-gap-20"
        >
          <div
            class="vdb-c-flex vdb-c-items-center vdb-c-gap-8 vdb-c-text-[16px] vdb-c-font-[500] vdb-c-leading-[19.6px] vdb-c-text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 21.577C11.4948 21.577 11.0593 21.402 10.6933 21.052C10.3273 20.702 10.1283 20.2744 10.0963 19.7693H13.9038C13.8718 20.2744 13.6728 20.702 13.3068 21.052C12.9408 21.402 12.5052 21.577 12 21.577ZM8.25 18.3845V16.8845H15.75V18.3845H8.25ZM8.40375 15.5C7.35642 14.8487 6.52733 13.9977 5.9165 12.947C5.3055 11.8965 5 10.7475 5 9.5C5 7.55133 5.6795 5.8975 7.0385 4.5385C8.3975 3.1795 10.0513 2.5 12 2.5C13.9487 2.5 15.6025 3.1795 16.9615 4.5385C18.3205 5.8975 19 7.55133 19 9.5C19 10.7475 18.6945 11.8965 18.0835 12.947C17.4727 13.9977 16.6436 14.8487 15.5962 15.5H8.40375ZM8.85 14H15.15C15.9 13.4667 16.4792 12.8083 16.8875 12.025C17.2958 11.2417 17.5 10.4 17.5 9.5C17.5 7.96667 16.9667 6.66667 15.9 5.6C14.8333 4.53333 13.5333 4 12 4C10.4667 4 9.16667 4.53333 8.1 5.6C7.03333 6.66667 6.5 7.96667 6.5 9.5C6.5 10.4 6.70417 11.2417 7.1125 12.025C7.52083 12.8083 8.1 13.4667 8.85 14Z"
                fill="#242424"
              />
            </svg>
            Meeting Checklist
          </div>

          <div
            v-if="localChecklist.length === 0"
            class="vdb-c-text-[13px] vdb-c-text-[#6B7280]"
          >
            No checklist items
          </div>
          <div
            v-else
            class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-start vdb-c-gap-12"
          >
            <TransitionGroup
              name="list-fade"
              tag="div"
              class="vdb-c-flex vdb-c-w-full vdb-c-flex-col vdb-c-items-start vdb-c-gap-12 vdb-c-self-stretch"
            >
              <label
                v-for="(item, idx) in localChecklist"
                :key="'c-' + idx + '-' + item.text"
                class="vdb-c-flex vdb-c-w-full vdb-c-cursor-pointer vdb-c-items-center vdb-c-gap-16 vdb-c-rounded-[10px] vdb-c-border vdb-c-border-[#EFEFEF] vdb-c-bg-white vdb-c-px-16 vdb-c-py-8"
              >
                <button
                  type="button"
                  class="vdb-c-flex vdb-c-h-[16px] vdb-c-w-[16px] vdb-c-min-w-[16px] vdb-c-items-center vdb-c-justify-center vdb-c-rounded-4 vdb-c-border vdb-c-transition"
                  :class="
                    item.covered
                      ? 'vdb-c-border-[#EC5B16] vdb-c-bg-[#EC5B16]'
                      : 'vdb-c-border-[#969696] vdb-c-bg-white'
                  "
                  @click="toggleChecklist(idx)"
                  :aria-pressed="item.covered ? 'true' : 'false'"
                >
                  <svg
                    v-if="item.covered"
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
                </button>

                <span
                  class="vdb-c-text-[14px] vdb-c-font-[500] vdb-c-leading-[24px] vdb-c-tracking-[0.07px] vdb-c-text-black"
                >
                  {{ item.text }}
                </span>
              </label>
            </TransitionGroup>
          </div>
        </section>
        <div class="vdb-c-h-[100px]"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref, onUnmounted, nextTick } from "vue";
import { useVideoDBChat } from "../../../context";
import Pinned from "./Pinned.vue";
import UnPinned from "./UnPinned.vue";
import Cross from "./Cross.vue";

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  isFloating: { type: Boolean, default: true },
});

const emit = defineEmits(["close", "toggle-floating"]);

const { canvasState } = useVideoDBChat();

/* ── Dragging and Resizing State ─────────────────────────────────── */
const modalRef = ref(null);
const position = ref({ x: 24, y: 24 });
const size = ref({ width: 397, height: 500 });

const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0, startX: 0, startY: 0 });

// match the spacing of right-12/top-12 (12 * 4px)
const EDGE_INSET = 12;

const modalStyle = computed(() => {
  if (!props.isFloating) return {};
  return {
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    width: `${size.value.width}px`,
    height: `${size.value.height}px`,
  };
});

/** Normalize escaped percent signs coming from the stream */
const normalize = (t = "") => t.replaceAll("\\%", "%").trim();

// Use content from canvas state instead of props
const content = computed(() => canvasState.content || {});

// ---- local reactive mirrors (so we always re-render on deep updates)
const liveInsights = ref([]);
const questions = ref([]);
const localChecklist = ref([]); // you already had this; leaving it here for clarity

watch(
  () => content.value?.meeting_assistant,
  (ma) => {
    liveInsights.value = [...(ma?.live_insights ?? [])];
    questions.value = [...(ma?.suggested_questions ?? [])];
    localChecklist.value = (ma?.meeting_checklist ?? []).map((x) => ({ ...x }));
  },
  { immediate: true, deep: true },
);

// derived views
const highPriority = computed(() =>
  liveInsights.value.filter(
    (x) => (x.type || "").toLowerCase() === "high priority",
  ),
);
const opportunities = computed(() =>
  liveInsights.value.filter(
    (x) => (x.type || "").toLowerCase() === "opportunity",
  ),
);
const highlights = computed(() =>
  liveInsights.value.filter(
    (x) => (x.type || "").toLowerCase() === "highlights",
  ),
);

const showAllHigh = ref(false);
const showAllOpp = ref(false);
const showAllHighlights = ref(false);
const latestTwo = (arr) => (arr.length <= 2 ? arr : arr.slice(-2));

const visibleHighPriority = computed(() =>
  showAllHigh.value ? highPriority.value : latestTwo(highPriority.value),
);
const visibleOpportunities = computed(() =>
  showAllOpp.value ? opportunities.value : latestTwo(opportunities.value),
);
const visibleHighlights = computed(() =>
  showAllHighlights.value ? highlights.value : latestTwo(highlights.value),
);

/**
 * Snap the floating modal to the parent container's top-right corner
 * while keeping drag/resize logic (which uses left/top) intact.
 */
async function snapToTopRight() {
  await nextTick();
  const el = modalRef.value;
  if (!el) return;
  // Prefer offsetParent (positioning context) and fall back if needed.
  const parent =
    el.offsetParent || el.parentElement || document.documentElement;
  const parentW = parent.clientWidth || window.innerWidth;
  const parentH = parent.clientHeight || window.innerHeight;

  // Ensure the modal fits within the parent with EDGE_INSET padding.
  const maxW = Math.max(
    360,
    Math.min(size.value.width, parentW - EDGE_INSET * 2),
  );
  const maxH = Math.max(
    160,
    Math.max(size.value.height, parentH - EDGE_INSET * 2),
  );
  size.value.width = maxW;
  size.value.height = maxH;

  // Compute the left needed so the box sits "right-12"
  position.value.x = Math.max(EDGE_INSET, parentW - maxW - EDGE_INSET);
  position.value.y = EDGE_INSET; // "top-12"
}

// When we become floating (unpinned), snap to top-right
watch(
  () => props.isFloating,
  (floating) => {
    if (floating && props.isOpen) snapToTopRight();
  },
);

function toggleSeeAll(which) {
  if (which === "high") showAllHigh.value = !showAllHigh.value;
  if (which === "opp") showAllOpp.value = !showAllOpp.value;
  if (which === "highlights")
    showAllHighlights.value = !showAllHighlights.value;
}

function toggleChecklist(idx) {
  const item = localChecklist.value[idx];
  if (item) item.covered = !item.covered;
}

/* ── Dragging Functions ───────────────────────────────────────────── */
function startDrag(e) {
  if (!props.isFloating) return;
  isDragging.value = true;
  dragStart.value = {
    x: e.clientX,
    y: e.clientY,
    startX: position.value.x,
    startY: position.value.y,
  };
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
  e.preventDefault();
}

function handleDrag(e) {
  if (!isDragging.value || !props.isFloating) return;
  const deltaX = e.clientX - dragStart.value.x;
  const deltaY = e.clientY - dragStart.value.y;
  position.value = {
    x: Math.max(0, dragStart.value.startX + deltaX),
    y: Math.max(0, dragStart.value.startY + deltaY),
  };
}

function stopDrag() {
  isDragging.value = false;
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
}

onUnmounted(() => {
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
});

/** When the modal re-opens, collapse the "see all" views for a clean start */
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      showAllHigh.value = false;
      showAllOpp.value = false;
      showAllHighlights.value = false;
      // Ensure correct initial anchor when opening in floating mode
      if (props.isFloating) snapToTopRight();
    }
  },
);
</script>
<style scoped>
/* Hide native scrollbar (keeps scroll functionality) */
.scrollbar-hide::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Modal fade/scale */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 180ms ease,
    transform 220ms ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}

/* List item transitions for live insights - fade only, no movement */
.insights-fade-enter-active,
.insights-fade-leave-active {
  transition: opacity 200ms ease;
}
.insights-fade-enter-from,
.insights-fade-leave-to {
  opacity: 0;
}

/* List item transitions for questions and checklist - with movement */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 200ms ease;
}
.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
.list-fade-move {
  transition: transform 200ms ease;
}

/* Small utility since we used size-28 (28px square) */
.vdb-c-size-28 {
  width: 28px;
  height: 28px;
}
</style>
