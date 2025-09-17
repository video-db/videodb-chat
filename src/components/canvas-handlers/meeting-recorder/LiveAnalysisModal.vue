<!-- LiveAnalysisModal.vue -->
<template>
  <aside
    id="live-analysis"
    ref="modalRef"
    class="vdb-c-absolute vdb-c-z-[50px] vdb-c-flex vdb-c-flex-col vdb-c-gap-[16px] vdb-c-rounded-[10px] vdb-c-border-[1.18px] vdb-c-border-[#E5E7EB] vdb-c-bg-white vdb-c-text-black vdb-c-shadow-2"
    :class="{
      'vdb-c-transition-all vdb-c-duration-200 vdb-c-ease-in-out':
        animateTransition,
    }"
    :style="modalStyle"
  >
    <!-- HEADER (styling copied exactly as requested; only title & buttons differ) -->
    <div
      class="vdb-c-flex vdb-c-w-full vdb-c-cursor-move vdb-c-items-center vdb-c-justify-between vdb-c-border-b vdb-c-border-gray-200 vdb-c-bg-[#F7F7F7] vdb-c-px-20 vdb-c-py-12"
      :class="{
        'vdb-c-cursor-move': viewMode !== 'top' && viewMode !== 'bottom',
      }"
      @mousedown="startDrag"
    >
      <div
        class="vdb-c-text-[18px] vdb-c-font-[600] vdb-c-capitalize vdb-c-leading-[27px] vdb-c-text-black"
      >
        Live Analysis
      </div>

      <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-8">
        <!-- Attach Top -->
        <button
          class="vdb-c-grid vdb-c-size-28 vdb-c-place-items-center vdb-c-rounded-8 vdb-c-border vdb-c-transition"
          aria-label="Attach Top"
          @click="changeViewMode('top')"
        >
          <AttachTop :fill="viewMode === 'top' ? '#EC5B16' : '#111827'" />
        </button>
        <!-- Attach Left -->
        <button
          class="vdb-c-grid vdb-c-size-28 vdb-c-place-items-center vdb-c-rounded-8 vdb-c-border vdb-c-transition"
          aria-label="Attach Left"
          @click="changeViewMode('left')"
        >
          <AttachLeft :fill="viewMode === 'left' ? '#EC5B16' : '#111827'" />
        </button>
        <!-- Attach Bottom -->
        <button
          class="vdb-c-grid vdb-c-size-28 vdb-c-place-items-center vdb-c-rounded-8 vdb-c-border vdb-c-transition"
          aria-label="Attach Bottom"
          @click="changeViewMode('bottom')"
        >
          <AttachBottom :fill="viewMode === 'bottom' ? '#EC5B16' : '#111827'" />
        </button>
        <!-- Close -->
        <button
          class="vdb-c-grid vdb-c-size-28 vdb-c-place-items-center vdb-c-rounded-8 vdb-c-border vdb-c-transition"
          title="Close"
          aria-label="Close"
          @click="emitClose"
        >
          <Cross className="vdb-c-text-[#111827]" fill="#111827" />
        </button>
      </div>
    </div>

    <!-- MAIN (scroll area) -->
    <div
      class="scrollbar-hide vdb-c-flex vdb-c-flex-[1_0_0] vdb-c-flex-col vdb-c-items-start vdb-c-gap-20 vdb-c-self-stretch vdb-c-overflow-auto vdb-c-rounded-b-[10px] vdb-c-bg-white vdb-c-p-20"
    >
      <!-- Live analysis list -->
      <TransitionGroup
        name="list-fade"
        tag="div"
        class="vdb-c-flex vdb-c-flex-col vdb-c-items-start vdb-c-gap-10 vdb-c-self-stretch"
      >
        <div
          v-for="(item, idx) in entries"
          :key="itemKey(item, idx)"
          :class="
            item.type === 'visual'
              ? 'vdb-c-rounded-10 vdb-c-flex vdb-c-flex-col vdb-c-items-start vdb-c-justify-center vdb-c-gap-12 vdb-c-self-stretch vdb-c-border vdb-c-border-[#5095FB] vdb-c-bg-[#EFF6FF] vdb-c-p-12'
              : 'vdb-c-flex vdb-c-flex-col vdb-c-items-start vdb-c-gap-8 vdb-c-self-stretch'
          "
        >
          <!-- top row (time + speaker) -->
          <div
            :class="
              item.type === 'visual'
                ? 'vdb-c-flex vdb-c-items-center vdb-c-gap-12 vdb-c-self-stretch'
                : 'vdb-c-flex vdb-c-items-center vdb-c-gap-12'
            "
          >
            <!-- time pill -->
            <span
              :class="
                item.type === 'visual'
                  ? 'vdb-c-inline-flex vdb-c-items-center vdb-c-gap-4 vdb-c-rounded-[7px] vdb-c-bg-[#E6F0FF] vdb-c-px-8 vdb-c-py-4 vdb-c-text-[13px] vdb-c-font-[600] vdb-c-leading-[16px] vdb-c-text-black'
                  : 'vdb-c-inline-flex vdb-c-items-center vdb-c-gap-4 vdb-c-rounded-[7px] vdb-c-bg-[#FFE9D3] vdb-c-px-8 vdb-c-py-4 vdb-c-text-[13px] vdb-c-font-[600] vdb-c-leading-[16px] vdb-c-text-black'
              "
              :style="
                item.type === 'visual' ? 'color:#5095FB' : 'color:#EC5B16'
              "
            >
              {{ formatTime(item.start) }}
            </span>

            <!-- speaker / label -->
            <span
              class="vdb-c-text-[13px] vdb-c-font-[500] vdb-c-leading-[16px] vdb-c-text-black"
            >
              {{
                item.type === "visual"
                  ? item.speaker || "Visual Analysis"
                  : item.speaker || "Speaker"
              }}
            </span>
          </div>

          <!-- transcript text -->
          <p
            :class="
              item.type === 'visual'
                ? 'vdb-c-text-[14px] vdb-c-font-[400] vdb-c-leading-[24px] vdb-c-text-black'
                : 'vdb-c-self-stretch vdb-c-text-[14px] vdb-c-font-[400] vdb-c-leading-[22px] vdb-c-text-black'
            "
          >
            {{ item.text }}
          </p>
        </div>
      </TransitionGroup>
    </div>

    <!-- Resize handles (only show when not in top/bottom view modes) -->
    <div
      v-if="viewMode !== 'top' && viewMode !== 'bottom'"
      class="vdb-c-absolute vdb-c-right-0 vdb-c-top-0 vdb-c-h-full vdb-c-w-2 vdb-c-cursor-col-resize vdb-c-bg-transparent"
      @mousedown="(e) => startResize('right', e)"
    ></div>
    <div
      v-if="viewMode !== 'top' && viewMode !== 'bottom'"
      class="vdb-c-absolute vdb-c-left-0 vdb-c-top-0 vdb-c-h-full vdb-c-w-2 vdb-c-cursor-col-resize vdb-c-bg-transparent"
      @mousedown="(e) => startResize('left', e)"
    ></div>
    <div
      v-if="viewMode !== 'top' && viewMode !== 'bottom'"
      class="vdb-c-absolute vdb-c-bottom-0 vdb-c-left-0 vdb-c-h-2 vdb-c-w-full vdb-c-cursor-row-resize vdb-c-bg-transparent"
      @mousedown="(e) => startResize('bottom', e)"
    ></div>
    <div
      v-if="viewMode !== 'top' && viewMode !== 'bottom'"
      class="vdb-c-absolute vdb-c-left-0 vdb-c-top-0 vdb-c-h-2 vdb-c-w-full vdb-c-cursor-row-resize vdb-c-bg-transparent"
      @mousedown="(e) => startResize('top', e)"
    ></div>
  </aside>
</template>

<script setup>
import Cross from "./Cross.vue";
import AttachTop from "./AttachTop.vue";
import AttachLeft from "./AttachLeft.vue";
import AttachBottom from "./AttachBottom.vue";
import { ref, computed, onUnmounted, watch } from "vue";
import { useVideoDBChat } from "../../../context";

/* ── Props / Emits ─────────────────────────────────────────────── */
const props = defineProps({});
const emit = defineEmits(["close"]);

const { canvasState } = useVideoDBChat();

/* ── View / Position / Resize (kept as-is) ─────────────────────── */
const viewMode = ref("left");
const modalRef = ref(null);
const animateTransition = ref(false);

const position = ref({ x: 24, y: 24 });
const size = ref({ width: 360, height: 400 });

const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0, startX: 0, startY: 0 });

const isResizing = ref(false);
const resizeStart = ref({
  x: 0,
  y: 0,
  startWidth: 0,
  startHeight: 0,
  startX: 0,
  startY: 0,
});
const resizeDirection = ref("");

const modalStyle = computed(() => {
  if (viewMode.value === "top") {
    return {
      left: "8px",
      top: "8px",
      right: "8px",
      width: "80%",
      height: "200px",
    };
  } else if (viewMode.value === "bottom") {
    return {
      left: "8px",
      bottom: "56px",
      right: "8px",
      width: "80%",
      height: "200px",
    };
  } else {
    return {
      left: `${position.value.x}px`,
      top: `${position.value.y}px`,
      width: `${size.value.width}px`,
      height: `${size.value.height}px`,
    };
  }
});

function emitClose() {
  emit("close");
}
function changeViewMode(mode) {
  animateTransition.value = true;
  viewMode.value = mode;
  setTimeout(() => (animateTransition.value = false), 250);
}
function startDrag(e) {
  if (viewMode.value === "top" || viewMode.value === "bottom") return;
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
  if (
    !isDragging.value ||
    viewMode.value === "top" ||
    viewMode.value === "bottom"
  )
    return;
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
function startResize(direction, event) {
  if (viewMode.value === "top" || viewMode.value === "bottom") return;
  isResizing.value = true;
  resizeDirection.value = direction;
  resizeStart.value = {
    x: event.clientX,
    y: event.clientY,
    startWidth: size.value.width,
    startHeight: size.value.height,
    startX: position.value.x,
    startY: position.value.y,
  };
  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);
  event.preventDefault();
}
function handleResize(e) {
  if (
    !isResizing.value ||
    viewMode.value === "top" ||
    viewMode.value === "bottom"
  )
    return;
  const dx = e.clientX - resizeStart.value.x;
  const dy = e.clientY - resizeStart.value.y;
  switch (resizeDirection.value) {
    case "right":
      size.value.width = Math.max(360, resizeStart.value.startWidth + dx);
      break;
    case "left": {
      const newW = Math.max(360, resizeStart.value.startWidth - dx);
      const newX =
        resizeStart.value.startX + (resizeStart.value.startWidth - newW);
      size.value.width = newW;
      position.value.x = Math.max(0, newX);
      break;
    }
    case "bottom":
      size.value.height = Math.max(160, resizeStart.value.startHeight + dy);
      break;
    case "top": {
      const newH = Math.max(160, resizeStart.value.startHeight - dy);
      const newY =
        resizeStart.value.startY + (resizeStart.value.startHeight - newH);
      size.value.height = newH;
      position.value.y = Math.max(0, newY);
      break;
    }
  }
}
function stopResize() {
  isResizing.value = false;
  resizeDirection.value = "";
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
}
onUnmounted(() => {
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
});

/* ── Transcript data (reactive to streaming updates) ───────────── */
const content = computed(() => canvasState.content || {});
const entries = ref([]);

watch(
  () => content.value?.live_analysis,
  (arr) => {
    entries.value = (arr || []).map((x) => ({ ...x }));
  },
  { immediate: true, deep: true },
);

/* ── Helpers ───────────────────────────────────────────────────── */
function formatTime(timestamp = 0) {
  // Handle microsecond timestamps (convert to milliseconds for Date constructor)
  const milliseconds = Math.floor(timestamp / 1_000);
  const date = new Date(milliseconds);

  // Format as HH:MM:SS in local timezone
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}
function itemKey(item, idx) {
  // deterministic key across updates
  return `${item.type || "speech"}-${item.speaker || "anon"}-${item.start}-${idx}`;
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* list animation */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 180ms ease;
}
.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* utility from your other modal */
.vdb-c-size-28 {
  width: 28px;
  height: 28px;
}
</style>
