<template>
  <div>
    <div
      v-for="(searchItem, index) in getArr()"
      :key="`search-results-${index}`"
      class="vdb-c-grid vdb-c-grid-cols-12 vdb-c-gap-24 sm:vdb-c-gap-32 vdb-c-border-b vdb-c-border-outline-xlight vdb-c-mb-28"
    >
      <div
        to="/video/figma-video"
        class="vdb-c-col-span-12 sm:vdb-c-col-span-6 md:vdb-c-col-span-4 lg:vdb-c-col-span-3"
      >
        <video-card-loader :index="index" />
      </div>
      <div
        class="vdb-c-col-span-12 md:vdb-c-col-span-8 lg:vdb-c-col-span-9 lg:vdb-c-pl-16 vdb-c-pb-40 vdb-c--mt-20 md:vdb-c-mt-0"
      >
        <div
          class="vdb-c-animate-pulse vdb-c-custom-duration vdb-c-relative vdb-c-bg-gray-400 vdb-c-rounded-16"
        >
          <img
            src="/images/right-popup-arrow.svg"
            class="vdb-c-absolute vdb-c-h-28 vdb-c-w-16 vdb-c-transform vdb-c-rotate-90 vdb-c--top-16 vdb-c-left-32 md:vdb-c-rotate-0 md:vdb-c--left-16 md:vdb-c-top-20"
          />
          <div class="vdb-c-h-152 vdb-c-bg-gray-400 vdb-c-rounded-16" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoCardLoader from '~/components/profile/VideoCardLoader.vue'

export default {
  name: 'SearchListItemLoader',
  components: {
    VideoCardLoader,
  },
  props: {
    limit: {
      type: Number,
      default: 3,
    },
  },
  methods: {
    getArr() {
      const arr = []
      for (let i = 0; i < this.limit; i++) {
        arr.push(i + 1)
      }
      return arr
    },
  },
}
</script>
