<template>
  <div
    class="vdb-c-p-0 md:vdb-c-px-24 md:vdb-c-pb-8 md:vdb-c-pt-14 md:vdb-c-rounded-t-20 vdb-c-relative md:vdb-c-bg-white vdb-c-flex vdb-c-items-center vdb-c-flex-col sm:vdb-c-flex-row md:vdb-c-border md:vdb-c-border-b-0 vdb-c-border-kilvish-300"
  >
    <span
      class="vdb-c-whitespace-nowrap vdb-c-pb-16 vdb-c-mr-8 vdb-c-text-kilvish-900 vdb-c-text-base vdb-c-font-medium vdb-c-hidden md:vdb-c-flex vdb-c-items-center"
      ><enter-icon class-name="vdb-c-mr-8" />
      {{ isEmpty ? 'Try Asking' : 'Ask a follow up' }}</span
    >
    <div
      ref="followUpContainer"
      class="vdb-c-scroll-snap vdb-c-flex md:vdb-c-flex-row vdb-c-flex-col vdb-c-gap-8 md:vdb-c-gap-16 md:vdb-c-items-center md:vdb-c-whitespace-nowrap md:vdb-c-overflow-x-auto md:vdb-c-pb-16 md:vdb-c-pr-76 vdb-c-p-8"
    >
      <follow-up
        v-for="(followUp, ind) in followUpPrompts"
        :key="ind"
        :content="followUp.search_query || followUp.action || followUp.unknown"
        @onClick="() => emit('followUpClicked', followUp)"
      />
    </div>
    <div
      v-show="showScroll === 'left' || showScroll === 'both'"
      class="vdb-c-absolute vdb-c-w-96 vdb-c-h-40 vdb-c-chevronLeft vdb-c-hidden md:vdb-c-flex vdb-c-items-center vdb-c-justify-start vdb-c-overflow-visible sm:vdb-c-left-180 vdb-c-left-22 sm:vdb-c-top-22 vdb-c-top-48 vdb-c-pl-4"
    >
      <button
        class="vdb-c-w-40 vdb-c-h-40 vdb-c-rounded-full vdb-c-bg-white vdb-c-shadow-blur vdb-c-flex vdb-c-items-center vdb-c-justify-center"
        @click="() => scrollList('prev')"
      >
        <chevron-right class-name="vdb-c-transform vdb-c-rotate-180" />
      </button>
    </div>
    <div
      v-show="showScroll === 'right' || showScroll === 'both'"
      class="vdb-c-absolute vdb-c-w-96 vdb-c-h-40 vdb-c-chevronRight vdb-c-hidden md:vdb-c-flex vdb-c-items-center vdb-c-justify-end vdb-c-overflow-visible vdb-c-shadow-xl sm:vdb-c-top-22 vdb-c-top-48 vdb-c-pr-4"
    >
      <button
        class="vdb-c-w-40 vdb-c-h-40 vdb-c-rounded-full vdb-c-bg-white vdb-c-shadow-blur vdb-c-flex vdb-c-items-center vdb-c-justify-center"
        @click="() => scrollList('next')"
      >
        <chevron-right />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import FollowUp from './FollowUp.vue'
import ChevronRight from '../../icons/ChevronRight.vue'
import EnterIcon from '../../icons/EnterIcon.vue'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isEmpty: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['followUpClicked'])

const showScroll = ref('right')
const followUpContainer = ref(null)

const followUpPrompts = computed(() => {
  return props.message.followup_content || []
})

watch(followUpPrompts, (val) => {
  if (val.length > 1) {
    nextTick(() => {
      setUpFollowUpListener()
    })
  }
}, { immediate: true })

const setUpFollowUpListener = () => {
  const f = followUpContainer.value
  if (!f) return
  f.addEventListener('scroll', (e) => {
    const scrollWidth = e.target.scrollWidth
    const clientWidth = e.target.clientWidth
    const scrollLeft = e.target.scrollLeft

    const maxScroll = parseInt(scrollWidth - clientWidth)
    if (scrollLeft < maxScroll && scrollLeft > 0) {
      showScroll.value = 'both'
    } else if (scrollLeft === 0) {
      showScroll.value = 'right'
    } else if (scrollLeft + 5 >= maxScroll) {
      showScroll.value = 'left'
    }
  })
}

const scrollList = (type) => {
  const cont = followUpContainer.value
  const nodeInView = getClosestElement(cont.childNodes, cont)
  const scrollVal =
    type === 'next'
      ? Math.min(cont.scrollLeft + nodeInView.offsetWidth, cont.scrollWidth)
      : Math.max(0, cont.scrollLeft - nodeInView.offsetWidth)

  cont.scrollTo({
    left: scrollVal,
    behaviour: 'smooth',
  })
}

const getClosestElement = (childNodes, parentNode) => {
  let closestNode = null
  let leastDifference = 99999
  for (let i = 0; i < childNodes.length; i++) {
    const val = Math.abs(childNodes[i].offsetLeft - parentNode.scrollLeft)
    if (val < leastDifference) {
      leastDifference = val
      closestNode = childNodes[i]
    }
  }
  return closestNode
}
</script>

<style scoped>
.vdb-c-chevronLeft {
  background: linear-gradient(90deg, #fff 0%, rgba(243, 244, 246, 0) 100%);
}

.vdb-c-chevronRight {
  right: 23px;
  background: linear-gradient(270deg, #fff 0%, rgba(243, 244, 246, 0) 100%);
}

.vdb-c-scroll-snap {
  scroll-snap-type: x proximity;
  scroll-padding-left: 10px;
  scroll-behavior: smooth;
  max-width: 100%;
  width: 100%;
}

.vdb-c-scroll-snap::-webkit-scrollbar {
  display: none;
}

.vdb-c-scroll-snap > div {
  scroll-snap-align: start;
}
</style>