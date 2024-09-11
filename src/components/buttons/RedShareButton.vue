<template>
  <button
    class="vdb-c-flex vdb-c-items-center vdb-c-px-12 vdb-c-py-8 vdb-c-font-medium vdb-c-text-white vdb-c-transition vdb-c-rounded-24 vdb-c-text-body vdb-c-text-dark"
    :class="{
      'vdb-c-bg-green': isTextCopied,
      'vdb-c-bg-primary-700 hover:vdb-c-bg-others-redfaded': !isTextCopied,
      [baseClass]: true,
    }"
    @click="copyText(true)"
  >
    <span>
      {{ isTextCopied ? successMessage : initialMessage }}
    </span>
  </button>
</template>

<script>
export default {
  props: {
    textToCopy: {
      type: String,
      required: true,
    },
    successMessage: {
      type: String,
      default: 'Copied!',
    },
    initialMessage: {
      type: String,
      default: 'Copy',
    },
    baseClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isTextCopied: false,
    }
  },
  methods: {
    copyText() {
      this.isTextCopied = true
      navigator.clipboard.writeText(this.textToCopy)
      setTimeout(() => {
        this.isTextCopied = false
      }, 5000)
    },
  },
}
</script>

<style>
</style>