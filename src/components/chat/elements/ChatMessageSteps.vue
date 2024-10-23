<template>
  <div class="vdb-c-flex vdb-c-flex-col vdb-c-gap-16">
    <button
      @click="toggleExpand"
      class="vdb-c-focus:outline-none vdb-c-flex vdb-c-items-center vdb-c-gap-8"
    >
      <ChevronDown
        :class="{ 'vdb-c-rotate-180 vdb-c-transform': isExpanded }"
        :stroke-width="2"
        :stroke-color="'#343E4F'"
      />
      <span class="vdb-c-text-sm vdb-c-font-medium vdb-c-text-kilvish-800"
        >Director's Log</span
      >
    </button>
    <transition
      enter-active-class="vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-out"
      enter-from-class="vdb-c-transform vdb-c-scale-95 vdb-c-opacity-0"
      enter-to-class="vdb-c-transform vdb-c-scale-100 vdb-c-opacity-100"
      leave-active-class="vdb-c-transition-all vdb-c-duration-300 vdb-c-ease-in"
      leave-from-class="vdb-c-transform vdb-c-scale-100 vdb-c-opacity-100"
      leave-to-class="vdb-c-transform vdb-c-scale-95 vdb-c-opacity-0"
    >
      <div
        v-if="isExpanded"
        class="vdb-c-shadow-sm vdb-c-overflow-hidden vdb-c-rounded-md vdb-c-bg-white"
      >
        <div
          class="vdb-c-flex vdb-c-flex-col vdb-c-gap-12 vdb-c-overflow-y-auto"
        >
          <div
            v-for="(step, index) in displaySteps"
            :key="index"
            class="vdb-c-flex vdb-c-items-center vdb-c-gap-8"
          >
            <span class="vdb-c-h-20 vdb-c-w-20 vdb-c-flex vdb-c-justify-center vdb-c-items-center">
              <span
                v-if="index !== displaySteps.length - 1"
                class="vdb-c-text-orange-500"
                >|</span
              >
              <div
                v-else
                class="vdb-c-block vdb-c-h-1/2 vdb-c-w-10 vdb-c-rounded-full"
                :class="
                  status === 'progress'
                    ? 'vdb-c-bg-orange-500 vdb-c-animate-pulse'
                    : 'vdb-c-bg-green-500'
                "
              ></div>
            </span>
            <span 
              class="vdb-c-flex-grow vdb-c-text-sm"
              :class="{
                'vdb-c-font-bold vdb-c-text-kilvish-800': status === 'success' && index === displaySteps.length - 1,
                'vdb-c-text-gray-600': !(status === 'success' && index === displaySteps.length - 1)
              }"
            >
              {{ step }}
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import ChevronDown from "../../icons/ChevronDown.vue";

const props = defineProps({
  steps: {
    type: Array,
    default: () => [],
  },
  status: {
    type: String,
    default: "progress",
    validator: (value) => ["progress", "success"].includes(value),
  },
  expanded: {
    type: Boolean,
    default: false,
  },
});

const isExpanded = ref(props.expanded);

watch(() => props.expanded, (newValue) => {
  if (!newValue) {
    isExpanded.value = false;
  }
});

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const displaySteps = computed(() => {
  if (props.steps.length === 0) {
    return ["Thinking"];
  }
  if (props.status === "success") {
    return [...props.steps, "Final Cut Approved by Spielberg"];
  }
  return props.steps;
});
</script>

<style scoped>
.vdb-c-text-orange-500 {
  color: #f97316;
}
.vdb-c-text-green-500 {
  color: #22c55e;
}
</style>
