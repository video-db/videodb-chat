<template>
  <button
    :class="['meeting-recorder-btn', { active: isActive }]"
    @click="onClick"
    v-bind="rest"
    type="button"
  >
    <component :is="icon" class="icon" />
    <span class="label">{{ label }}</span>
  </button>
</template>

<script setup>
import { computed, useAttrs } from "vue";

const props = defineProps({
  icon: {
    type: [Object, Function, String],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  onClick: {
    type: Function,
    default: () => {},
  },
});

const attrs = useAttrs();
const rest = computed(() => {
  // Remove props we handle explicitly
  const { icon, label, isActive, onClick, ...other } = attrs;
  return other;
});
</script>

<style scoped>
.meeting-recorder-btn {
  display: inline-flex;
  padding: 16px 20px 16px 16px;
  align-items: center;
  gap: 12px;
  border-radius: 40px;
  background: var(--Ota, #2d2d2d);
  border: none;
  color: #fff;
  cursor: pointer;
  transition: all 0.15s;
  font: inherit;
  outline: none;
}

.meeting-recorder-btn:hover {
  background: var(--Pam, #464646);
}

.meeting-recorder-btn.active,
.meeting-recorder-btn:active {
  background: var(--Orange-VDB, #ec5b16);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0;
}

.label {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  user-select: none;
}
</style>
