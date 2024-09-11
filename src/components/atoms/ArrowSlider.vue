<template>
  <div class="vdb-c-w-full vdb-c-max-w-full vdb-c-relative">
    <div
      ref="scrollContainer"
      class="scroll-snap vdb-c-w-full vdb-c-max-w-full vdb-c-flex vdb-c-items-center vdb-c-gap-8 vdb-c-overflow-x-auto vdb-c-whitespace-nowrap"
      :class="containerClass"
    >
      <slot></slot>
    </div>
    <div
      v-show="
        isScrollNeeded && (showScroll === 'left' || showScroll === 'both')
      "
      class="vdb-c-absolute vdb-c-w-96 vdb-c-h-full chevronLeft vdb-c-flex vdb-c-items-center vdb-c-justify-start vdb-c-overflow-visible vdb-c-left-0 vdb-c-top-0 vdb-c-pl-4"
    >
      <button
        class="vdb-c-hidden md:vdb-c-flex vdb-c-w-40 vdb-c-h-40 vdb-c-rounded-full vdb-c-bg-white vdb-c-shadow-blur vdb-c-items-center vdb-c-justify-center"
        @click="() => scrollList('prev')"
      >
        <chevron-right class-name="vdb-c-transform vdb-c-rotate-180" />
      </button>
    </div>
    <div
      v-show="
        isScrollNeeded && (showScroll === 'right' || showScroll === 'both')
      "
      class="vdb-c-absolute vdb-c-w-96 vdb-c-h-full chevronRight vdb-c-flex vdb-c-items-center vdb-c-justify-end vdb-c-overflow-visible vdb-c-shadow-xl vdb-c-right-0 vdb-c-top-0 vdb-c-pr-4"
    >
      <button
        class="vdb-c-hidden md:vdb-c-flex vdb-c-w-40 vdb-c-h-40 vdb-c-rounded-full vdb-c-bg-white vdb-c-shadow-blur vdb-c-items-center vdb-c-justify-center"
        @click="() => scrollList('next')"
      >
        <chevron-right />
      </button>
    </div>
  </div>
</template>

<script>
import ChevronRight from '../icons/ChevronRight.vue'
export default {
  components: { ChevronRight },
  props: {
    containerClass: {
      type: String,
      default: '',
    },
    contentRendered: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showScroll: 'right',
      isScrollNeeded: false,
    }
  },
  watch: {
    contentRendered: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.setUpScrollListener()
          })
        }
      },
      immediate: true,
    },
  },
  methods: {
    setUpScrollListener() {
      const f = this.$refs.scrollContainer
      if (!f) return
      if (f.scrollWidth > f.clientWidth) {
        this.isScrollNeeded = true
      }
      f.addEventListener('scroll', (e) => {
        const scrollWidth = e.target.scrollWidth
        const clientWidth = e.target.clientWidth
        const scrollLeft = e.target.scrollLeft
        const maxScroll = parseInt(scrollWidth - clientWidth)
        if (scrollLeft < maxScroll && scrollLeft > 0) {
          this.showScroll = 'both'
        } else if (scrollLeft === 0) {
          this.showScroll = 'right'
        } else if (scrollLeft + 5 >= maxScroll) {
          this.showScroll = 'left'
        }
      })
    },
    scrollList(type) {
      const cont = this.$refs.scrollContainer
      if (!cont) return
      const nodeInView = this.getClosestElement(cont.childNodes, cont)
      const scrollVal =
        type === 'next'
          ? Math.min(cont.scrollLeft + nodeInView.offsetWidth, cont.scrollWidth)
          : Math.max(0, cont.scrollLeft - nodeInView.offsetWidth)

      cont.scrollTo({
        left: scrollVal,
        behaviour: 'smooth',
      })
    },
    getClosestElement(childNodes, parentNode) {
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
    },
  },
}
</script>

<style scoped>
.chevronLeft {
  background: linear-gradient(90deg, #fff 0%, rgba(243, 244, 246, 0) 100%);
}

.chevronRight {
  background: linear-gradient(270deg, #fff 0%, rgba(243, 244, 246, 0) 100%);
}

.scroll-snap {
  scroll-snap-type: x proximity;
  scroll-padding-left: 100px;
  scroll-behavior: smooth;
  max-width: 100%;
  width: 100%;
}

.scroll-snap::-webkit-scrollbar {
  display: none;
}

.scroll-snap > div {
  scroll-snap-align: start;
}
</style>