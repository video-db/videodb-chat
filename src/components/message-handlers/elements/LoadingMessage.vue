<!-- <template>
  <div class="vdb-c-flex vdb-c-items-center vdb-c-space-x-2">
    <span v-if="status === 'progress'" class="vdb-c-text-gray-500 vdb-c-animate-pulse">
      {{ message }}
    </span>
    <span v-else-if="status === 'success'" class="vdb-c-text-red-500">
      {{ message }}
    </span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['progress', 'success'].includes(value)
  },
  message: {
    type: String,
    required: true
  }
});
</script> -->