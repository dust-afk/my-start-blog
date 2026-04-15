<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/45 px-4 py-6 backdrop-blur-sm"
      @click.self="handleClose"
    >
      <section class="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <header class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">AI 摘要</h2>
        </header>

        <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
          这是一段 mock 摘要：本文聚焦于前端工程实践，围绕组件拆分、样式规范与可维护性展开，强调通过明确边界和可复用模式来提升开发效率。
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in keywords"
            :key="tag"
            class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
          >
            {{ tag }}
          </span>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            @click="handleClose"
          >
            关闭
          </button>
        </div>
      </section>
    </div>
  </teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

const keywords = ['Vue 3', 'WindiCSS', '组件化', '可维护性', '前端工程']

const handleClose = (): void => {
  if (!props.open) {
    return
  }
  emit('update:open', false)
}
</script>
