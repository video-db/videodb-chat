<template>
  <div
    v-if="showDialog"
    class="vdb-c-fixed vdb-c-inset-0 vdb-c-z-50 vdb-c-bg-black/50 vdb-c-flex vdb-c-items-center vdb-c-justify-center"
    @click="$emit('cancel')"
  >
    <div
      class="vdb-c-w-[512px] vdb-c-min-w-[512px] vdb-c-rounded-lg vdb-c-bg-white vdb-c-shadow-xl vdb-c-flex vdb-c-flex-col"
      @click.stop
    >
      <!-- Modal Content -->
      <div class="vdb-c-px-30 vdb-c-py-30 vdb-c-flex vdb-c-flex-col">
        <!-- Modal Header -->
        <div class="vdb-c-flex vdb-c-items-center vdb-c-pb-30">
          <div
            class="vdb-c-w-40 vdb-c-h-40 vdb-c-rounded-full vdb-c-flex vdb-c-items-center vdb-c-justify-center vdb-c-bg-[#FFE9D3]"
          >
            <CreateCollectionIcon />
          </div>
          <h2 class="vdb-c-text-[18px] vdb-c-ml-[10px] vdb-c-font-medium vdb-c-text-gray-950">
            New Collection
          </h2>
        </div>

        <!-- Input Fields -->
        <div class="vdb-c-flex vdb-c-flex-col vdb-c-gap-[10px]">
          <input
            id="collectionName"
            v-model="newCollection.name"
            type="text"
            class="vdb-c-w-full vdb-c-px-10 vdb-c-py-8 vdb-c-text-[14px] vdb-c-text-kilvish-900 vdb-c-border vdb-c-border-gray-300 vdb-c-rounded-md vdb-c-box-border focus:vdb-c-border-orange-500 focus:vdb-c-outline-none"
            placeholder="Collection Name (required)"
          />
          <textarea
            id="collectionDescription"
            v-model="newCollection.description"
            class="vdb-c-w-full vdb-c-px-10 vdb-c-py-8 vdb-c-text-[14px] vdb-c-text-kilvish-900 vdb-c-border vdb-c-border-gray-300 vdb-c-rounded-md vdb-c-box-border focus:vdb-c-border-orange-500 focus:vdb-c-outline-none"
            placeholder="Description"
          ></textarea>
        </div>
      </div>

      <div class="vdb-c-w-full vdb-c-bg-gray-50 vdb-c-rounded-b-[8px]">
        <div class="vdb-c-flex vdb-c-justify-end vdb-c-items-center vdb-c-gap-8 vdb-c-px-24 vdb-c-py-12">
          <button
            class="vdb-c-flex vdb-c-items-center vdb-c-justify-center vdb-c-px-16 vdb-c-py-8 vdb-c-text-sm vdb-c-font-medium vdb-c-text-gray-700 vdb-c-border vdb-c-border-gray-300 vdb-c-rounded-md vdb-c-bg-white hover:vdb-c-bg-gray-200 vdb-c-w-full sm:vdb-c-w-auto"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
          <button
            :disabled="!newCollection.name.trim()"
            :class="[
              'vdb-c-flex vdb-c-items-center vdb-c-justify-center vdb-c-px-16 vdb-c-py-8 vdb-c-text-sm vdb-c-font-medium vdb-c-rounded-md vdb-c-w-full sm:vdb-c-w-auto',
              newCollection.name.trim()
                    ? 'vdb-c-text-white vdb-c-bg-[#EC5B16] hover:vdb-c-bg-[#D94E14]'
                    : 'vdb-c-text-white vdb-c-bg-[#969696] cursor-not-allowed'
            ]"
            @click="handleCreateCollection"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits } from "vue";
import CreateCollectionIcon from "../icons/CreateCollection.vue";

defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["cancel", "create"]);

const newCollection = reactive({
  name: "",
  description: "",
});

const handleCreateCollection = () => {
  if (!newCollection.name.trim()) {
    alert("Collection name cannot be empty.");
    return;
  }
  emit("create", { ...newCollection });

  newCollection.name = "";
  newCollection.description = "";
};
</script>
