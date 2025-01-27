<template>
  <div
    v-if="showCreateCollectionModal"
    class="vdb-c-fixed vdb-c-inset-0 vdb-c-z-50 vdb-c-bg-black/50 vdb-c-flex vdb-c-items-center vdb-c-justify-center"
    @click="cancelCreateCollection"
  >
    <div
      class="vdb-c-w-[400px] vdb-c-rounded-lg vdb-c-bg-white vdb-c-shadow-lg vdb-c-px-8 vdb-c-py-6"
      @click.stop
    >
      <!-- Modal Header -->
      <h2 class="vdb-c-mb-4 vdb-c-text-lg vdb-c-font-bold vdb-c-flex vdb-c-items-center vdb-c-gap-2">
        <svg
          class="vdb-c-w-6 vdb-c-h-6 vdb-c-text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v12m6-6H6"
          />
        </svg>
        New Collection
      </h2>

      <!-- Input for Collection Name -->
      <div class="vdb-c-mb-4">
        <label
          for="collectionName"
          class="vdb-c-text-sm vdb-c-font-medium vdb-c-text-gray-700"
        >
          Collection Name
        </label>
        <input
          id="collectionName"
          v-model="newCollectionName"
          type="text"
          class="vdb-c-w-full vdb-c-rounded-lg vdb-c-border vdb-c-border-gray-300 vdb-c-px-4 vdb-c-py-2 vdb-c-text-sm vdb-c-font-medium vdb-c-placeholder-gray-400"
          placeholder="Enter collection name"
        />
      </div>

      <!-- Input for Description -->
      <div class="vdb-c-mb-6">
        <label
          for="collectionDescription"
          class="vdb-c-text-sm vdb-c-font-medium vdb-c-text-gray-700"
        >
          Description
        </label>
        <textarea
          id="collectionDescription"
          v-model="newCollectionDescription"
          class="vdb-c-w-full vdb-c-rounded-lg vdb-c-border vdb-c-border-gray-300 vdb-c-px-4 vdb-c-py-2 vdb-c-text-sm vdb-c-font-medium vdb-c-placeholder-gray-400"
          placeholder="Enter collection description"
        ></textarea>
      </div>

      <!-- Buttons -->
      <div class="vdb-c-flex vdb-c-justify-end vdb-c-gap-4">
        <button
          class="vdb-c-bg-gray-200 vdb-c-text-gray-700 vdb-c-px-4 vdb-c-py-2 vdb-c-text-sm vdb-c-font-medium vdb-c-rounded-lg hover:vdb-c-bg-gray-300"
          @click="cancelCreateCollection"
        >
          Cancel
        </button>
        <button
          class="vdb-c-bg-orange-500 vdb-c-text-white vdb-c-px-4 vdb-c-py-2 vdb-c-text-sm vdb-c-font-medium vdb-c-rounded-lg hover:vdb-c-bg-orange-600"
          @click="submitNewCollection"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showCreateCollectionModal = ref(false);
const newCollectionName = ref("");
const newCollectionDescription = ref("");

const toggleCreateCollectionModal = () => {
  showCreateCollectionModal.value = !showCreateCollectionModal.value;
};

const cancelCreateCollection = () => {
  newCollectionName.value = "";
  newCollectionDescription.value = "";
  showCreateCollectionModal.value = false;
};

const submitNewCollection = () => {
  if (!newCollectionName.value.trim()) {
    alert("Collection name cannot be empty.");
    return;
  }

  console.log("Collection Name:", newCollectionName.value);
  console.log("Description:", newCollectionDescription.value);

  newCollectionName.value = "";
  newCollectionDescription.value = "";
  showCreateCollectionModal.value = false;
};
</script>

<style scoped>
/* Transition Effect */
.vdb-c-fade-enter-active,
.vdb-c-fade-leave-active {
  transition: opacity 0.3s ease;
}
.vdb-c-fade-enter-from,
.vdb-c-fade-leave-to {
  opacity: 0;
}
</style>
