<template>
  <transition name="fade">
    <div
      v-if="showCreateCollectionModal"
      class="vdb-c-fixed vdb-c-inset-0 vdb-c-z-50 vdb-c-bg-black/50 vdb-c-flex vdb-c-items-center vdb-c-justify-center"
    >
      <div class="vdb-c-w-1/3 vdb-c-rounded-lg vdb-c-bg-white vdb-c-shadow-lg vdb-c-p-8">
        <h2 class="vdb-c-mb-4 vdb-c-text-lg vdb-c-font-bold">Create New Collection</h2>
        
        <!-- Input for Collection Name -->
        <div class="vdb-c-mb-6">
          <label class="vdb-c-text-sm vdb-c-font-medium vdb-c-block vdb-c-mb-2" for="collectionName">
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
        
        <!-- Buttons -->
        <div class="vdb-c-flex vdb-c-justify-end vdb-c-gap-4">
          <button
            class="vdb-c-bg-gray-200 vdb-c-px-4 vdb-c-py-2 vdb-c-text-sm vdb-c-font-medium vdb-c-rounded-lg hover:vdb-c-bg-gray-300"
            @click="cancelCreateCollection"
          >
            Cancel
          </button>
          <button
            class="vdb-c-bg-roy vdb-c-text-white vdb-c-px-4 vdb-c-py-2 vdb-c-text-sm vdb-c-font-medium vdb-c-rounded-lg hover:vdb-c-bg-roy-dark"
            @click="submitNewCollection"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";

const showCreateCollectionModal = ref(false);
const newCollectionName = ref("");

const toggleCreateCollectionModal = () => {
  showCreateCollectionModal.value = !showCreateCollectionModal.value;
};

const cancelCreateCollection = () => {
  newCollectionName.value = ""; // Clear input
  showCreateCollectionModal.value = false; // Close modal
};

const submitNewCollection = () => {
  if (!newCollectionName.value.trim()) {
    alert("Collection name cannot be empty.");
    return;
  }
  // Emit event or handle the submission logic
  console.log("New collection name:", newCollectionName.value);

  // Reset and close modal
  newCollectionName.value = "";
  showCreateCollectionModal.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
