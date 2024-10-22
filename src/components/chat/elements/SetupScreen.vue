<template>
  <div
    class="vdb-c-flex vdb-c-h-full vdb-c-w-full vdb-c-items-center vdb-c-justify-center"
  >
    <div class="vdb-c-flex vdb-c-w-4/6 vdb-c-flex-col vdb-c-gap-8">
      <h1
        class="vdb-c-mb-24 vdb-c-text-5xl vdb-c-font-extrabold vdb-c-text-vdb-darkishgrey"
      >
        Welcome to Spielberg.
      </h1>

      <div
        class="vdb-c-relative vdb-c-mb-12 vdb-c-gap-10 vdb-c-rounded-lg vdb-c-border vdb-c-border-primary vdb-c-bg-red-100 vdb-c-px-24 vdb-c-py-20"
      >
        <div class="vdb-c-flex vdb-c-items-center vdb-c-justify-between">
          <div class="vdb-c-flex vdb-c-items-center vdb-c-gap-8">
            <RedExclamation />
            <strong class="vdb-c-ml-2 vdb-c-font-bold vdb-c-text-red"
              >Your setup is incomplete</strong
            >
          </div>
          <span class="vdb-c-font-medium vdb-c-text-red"
            >{{ incompleteCount }} of {{ totalCount }} missing</span
          >
        </div>
        <p class="vdb-c-text-pam">
          Please provide the missing information so we can get started.
        </p>
      </div>

      <div
        class="vdb-c-grid vdb-c-grid-cols-1 vdb-c-gap-16 sm:vdb-c-grid-cols-2 md:vdb-c-grid-cols-3 lg:vdb-c-grid-cols-4"
      >
        <SetupCard
          v-for="(status, key) in configStatus"
          :key="key"
          :title="setupMapping[key].title"
          :status="status ? 'complete' : 'incomplete'"
          :message="
            status
              ? setupMapping[key].completeText
              : setupMapping[key].incompleteText
          "
          :action="setupMapping[key].action"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import SetupCard from "./SetupCard.vue";
import RedExclamation from "../../icons/RedExclamation.vue";

const props = defineProps({
  configStatus: {
    type: Object,
    required: true,
  },
});

const setupMapping = {
  db_configured: {
    title: "Database Config",
    completeText: "",
    incompleteText: "Unable to locate",
    action: {
      text: "Manage setup",
      link: "https://docs.videodb.io",
      target: "_blank",
    },
  },
  llm_configured: {
    title: "LLM Connection",
    completeText: "LLM Configured",
    incompleteText: "LLM not configured",
    action: {
      text: "Change model",
      link: "https://docs.videodb.io",
      target: "_blank",
    },
  },
  videodb_configured: {
    title: "VideoDB Setup",
    completeText: "",
    incompleteText: "API key not found",
    action: {
      text: "Add key",
      link: "https://docs.videodb.io",
      target: "_blank",
    },
  },
};

const incompleteCount = computed(() => {
  return Object.values(props.configStatus).filter((status) => !status).length;
});
const totalCount = computed(() => Object.keys(props.configStatus).length);
</script>

<style>
/* Add any additional styles here if needed */
</style>
