<template>
  <div class="vdb-c-flex vdb-c-flex-col vdb-c-h-full video-card vdb-c-px-30 sm:vdb-c-p-0 vdb-c-cursor-pointer">
    <div
      class="vdb-c-flex vdb-c-flex-col sm:vdb-c-flex-row sm:vdb-c-block vdb-c-mb-24"
      :class="{ 'vdb-c-flex-grow': borderB }"
    >
      <div
        class="vdb-c-w-auto vdb-c-min-w-96 sm:vdb-c-w-full sm:vdb-c-min-w-auto sm:vdb-c-mr-24 sm:vdb-c-min-w-0 sm:vdb-c-mb-16"
      >
        <div class="vdb-c-relative vdb-c-rounded-12 vdb-c-bg-white vdb-c-overflow-hidden vid-pb">
          <div
            class="thumbnail vdb-c-rounded-12 vdb-c-absolute vdb-c-top-0 vdb-c-left-0 vdb-c-right-0 vdb-c-bottom-0 vdb-c-bg-cover vdb-c-bg-no-repeat vdb-c-bg-center vdb-c-shadow-1 vdb-c-h-106"
            :style="{
              backgroundImage: item.thumbnail_url ? `url('${item.thumbnail_url}')` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }"
          >
            <div v-if="!item.thumbnail_url" class="vdb-c-absolute vdb-c-inset-0 vdb-c-flex vdb-c-items-center vdb-c-justify-center vdb-c-text-white vdb-c-text-xl vdb-c-font-bold">
              {{ item.name ? item.name.split(' ').slice(0, 3).join(' ') + '...' : 'Video...' }}
            </div>
          </div>
          <div
            class="vdb-c-flex vdb-c-absolute vdb-c-top-1/2 vdb-c-left-1/2 vdb-c-h-48 vdb-c-w-48 lg:vdb-c-h-56 lg:vdb-c-w-56 vdb-c-rounded-full vdb-c-items-center vdb-c-justify-center vdb-c-transform -vdb-c-translate-x-1/2 -vdb-c-translate-y-1/2 center-button transparent-button"
          >
            <PlayIcon class="vdb-c-h-20 vdb-c-w-20" />
          </div>
        </div>
      </div>
      <div class="vdb-c-text-black vdb-c-flex vdb-c-flex-col vdb-c-justify-center fade-on-hover">
        <p class="vdb-c-text-subheader vdb-c-font-medium vdb-c-mb-8 vdb-c-text-elip vdb-c-whitespace-normal">
          {{ item.name}}
        </p>
        <div class="vdb-c-flex vdb-c-items-center">
          <div class="vdb-c-flex vdb-c-items-center vdb-c-mr-16">
            <TimeIcon class="vdb-c-w-16 vdb-c-mr-2" />
            <p class="vdb-c-text-caption1 vdb-c-font-medium vdb-c-text-textlight">
              {{ secondsToHHMMSS(item.length || 0) }}
            </p>
          </div>
          <div class="vdb-c-flex vdb-c-items-center vdb-c-text-textlight">
            <comment-line class-name="vdb-c-w-16 vdb-c-mr-2" />
            <p class="vdb-c-text-caption1 vdb-c-font-medium vdb-c-text-textlight">
              {{ item.comments ? Object.keys(item.comments).length : 0 }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="borderB"
      class="vdb-c-border-b vdb-c-border-outline-xlight lg:vdb-c-mb-16"
      :class="`${index % 2 === 0 ? 'sm:vdb-c--mr-32' : 'sm:vdb-c-mr-0'} ${
        index % 3 !== 2 ? 'md:vdb-c--mr-32' : 'md:vdb-c-mr-0'
      } ${index % 4 !== 3 ? 'lg:vdb-c--mr-32' : 'lg:vdb-c-mr-0'} ${borderClass}`"
    />
  </div>
</template>

<script>
import CommentLine from '../icons/CommentLine.vue'
import PlayIcon from '../icons/play.vue'
import TimeIcon from '../icons/time.vue'

export default {
  name: 'VideoCard',
  components: {
    CommentLine,
    PlayIcon,
    TimeIcon,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
    borderB: {
      type: Boolean,
      default: false,
    },
    borderClass: {
      type: String,
      default: '',
    },
  },
  methods: {
    secondsToHHMMSS(val) {
      if (!val) return '00:00:00'
      let time = ''
      time = new Date(val * 1000).toISOString().substring(11, 19)
      if (time.substring(0, 2) === '00') {
        return time.substring(3, time.length)
      }
      return time
    },
  },
}
</script>

<style scoped>
.transparent-button {
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(16px);
  color: #fff;
  opacity: 0;
}

.vid-pb {
  padding-bottom: 75%;
}

.text-elip {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.center-button,
.fade-on-hover {
  transition: all 0.3s ease-in-out;
}
.thumbnail {
  transition: transform 0.5s linear;
  transform-origin: center;
  transform: scale(1.001);
}
@media (max-width: 640px) {
  .thumbnail {
    height: 106px;
  }
  .vid-pb {
    padding-bottom: 40%;
  }
}

@media (any-hover: hover) {
  .video-card:hover .center-button {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
    background: rgba(0, 0, 0, 0.32);
    transform-origin: center;
  }
  .video-card:hover .fade-on-hover {
    opacity: 0.6;
  }
  .video-card:hover .thumbnail {
    transform: scale(1.05);
  }
}
</style>
