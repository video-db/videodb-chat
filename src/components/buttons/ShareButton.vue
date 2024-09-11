<template>
  <button
    class="vdb-c-relative vdb-c-w-40 vdb-c-h-40 vdb-c-rounded-full vdb-c-flex vdb-c-items-center vdb-c-justify-center vdb-c-group"
    :class="{
      'vdb-c-bg-green': isCopied,
      'vdb-c-bg-white hover:vdb-c-bg-kilvish-400': !isCopied,
    }"
    @click="handleShare"
  >
    <share v-if="!isCopied" class-name="vdb-c-w-18 vdb-c-h-18" />
    <white-check-icon v-else class-name="vdb-c-w-18 vdb-c-h-18" />
    <div
      class="vdb-c-absolute vdb-c--bottom-full vdb-c-left-1/2 vdb-c-transform vdb-c-translate-y-6 vdb-c-rounded-8 vdb-c-text-white vdb-c-px-10 vdb-c-py-8 vdb-c-whitespace-nowrap"
      :class="{
        'vdb-c-bg-kilvish-800 vdb-c-hidden group-hover:vdb-c-block --translate-x-1/2': !isCopied,
        'vdb-c-bg-green --translate-x-2/3': isCopied,
      }"
    >
      {{ isCopied ? 'Link Copied' : 'Share' }}
    </div>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import Share from '../icons/Share.vue'
import WhiteCheckIcon from '../icons/WhiteCheckIcon.vue'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})

const isCopied = ref(false)

const handleShare = () => {
  if (isCopied.value) return
  navigator.clipboard.writeText(props.value)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 5000)
}
</script>
