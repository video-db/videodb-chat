<template>
  <div
    v-if="showDialog"
    class="modal-backdrop"
    @click="$emit('cancel')"
  >
    <div
      class="modal-container"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="icon-container">
          <CreateCollectionIcon />
        </div>
        <h2 class="modal-title">New Collection</h2>
      </div>

      <!-- Input for Collection Name -->
      <div class="input-container">
        <input
          id="collectionName"
          v-model="newCollection.name"
          type="text"
          class="input"
          placeholder="Collection name"
        />
      </div>

      <!-- Input for Description -->
      <div class="input-container">
        <textarea
          id="collectionDescription"
          v-model="newCollection.description"
          class="input"
          placeholder="Description"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button
          class="btn btn-cancel"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
        <button
          class="btn btn-create"
          @click="handleCreateCollection"
        >
          Create
        </button>
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

const handlecreateCollection = () => {
  if (!newCollection.name.trim()) {
    alert("Collection name cannot be empty.");
    return;
  }

  if (!newCollection.description.trim()) {
    alert("Collection description cannot be empty.");
    return;
  }
  emit("create", { ...newCollection });

  newCollection.name = "";
  newCollection.description = "";
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
}

.modal-container {
  display: flex;
  flex-direction: column;
  padding: 30px;
  padding-bottom: 0;
  gap: 30px;
  width: 512px;
  background: #ffffff;
  box-shadow: 0px 20px 25px -5px rgba(0, 0, 0, 0.1),
    0px 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-container {
  width: 40px;
  height: 40px;
  background: #ffe9d3;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  color: #111827;
}

.input-container {
  width: 100%;
}

.input {
  width: 100%;
  padding: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  line-height: 20px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-sizing: border-box;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-bottom: 12px;
  background: #f9fafb;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 9px 17px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 20px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancel {
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-cancel:hover {
  background: #f3f4f6;
}

.btn-create {
  background: #ec5b16;
  color: #ffffff;
  border: none;
}

.btn-create:hover {
  background: #d94e14;
}
</style>
