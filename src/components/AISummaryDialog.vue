<template>
  <teleport to="body">
    <div v-if="open" class="dialog-mask" @click.self="emit('close')">
      <section class="dialog-panel" role="dialog" aria-modal="true" aria-label="AI助手总结">
        <header class="dialog-head">
          <h2>AI 助手总结</h2>
          <button type="button" class="close-btn" aria-label="关闭" @click="emit('close')">×</button>
        </header>

        <div v-if="loading" class="state-text">正在生成摘要，请稍候...</div>

        <div v-else-if="error" class="state-error">
          <p>{{ error }}</p>
          <button type="button" class="retry-btn" @click="emit('retry')">重试</button>
        </div>

        <template v-else-if="result">
          <p class="summary-text">{{ result.summary }}</p>

          <section v-if="result.bullets.length" class="bullet-wrap">
            <h3>关键点</h3>
            <ul>
              <li v-for="item in result.bullets" :key="item">{{ item }}</li>
            </ul>
          </section>

          <section v-if="result.keywords.length" class="keyword-wrap">
            <h3>关键词</h3>
            <div class="keywords">
              <span v-for="keyword in result.keywords" :key="keyword">{{ keyword }}</span>
            </div>
          </section>
        </template>
      </section>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import type { AiSummaryResult } from '@/utils/aiSummary'

defineProps<{
  open: boolean
  loading: boolean
  error: string
  result: AiSummaryResult | null
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'retry'): void
}>()
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(16, 23, 35, 0.42);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.dialog-panel {
  width: min(680px, 100%);
  max-height: min(82vh, 720px);
  overflow: auto;
  border: 2px solid var(--line-strong);
  border-radius: 12px;
  background: var(--card);
  padding: 16px;
  box-shadow: 0 20px 40px rgba(6, 14, 24, 0.24);
}

.dialog-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.dialog-head h2 {
  margin: 0;
  color: var(--text);
  font-size: 22px;
}

.close-btn {
  width: 30px;
  height: 30px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel-soft);
  color: var(--muted-strong);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.state-text,
.state-error {
  margin-top: 14px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.state-error p {
  margin: 0;
}

.retry-btn {
  margin-top: 10px;
  height: 34px;
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  background: var(--panel);
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
  padding: 0 12px;
  cursor: pointer;
}

.summary-text {
  margin: 14px 0 0;
  color: var(--muted-strong);
  font-size: 15px;
  line-height: 1.75;
}

.bullet-wrap,
.keyword-wrap {
  margin-top: 14px;
}

.bullet-wrap h3,
.keyword-wrap h3 {
  margin: 0;
  color: var(--text);
  font-size: 16px;
}

.bullet-wrap ul {
  margin: 8px 0 0;
  padding-left: 20px;
}

.bullet-wrap li {
  margin-bottom: 8px;
  color: var(--muted-strong);
  font-size: 14px;
  line-height: 1.65;
}

.keywords {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keywords span {
  height: 28px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--panel-soft);
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 600;
}
</style>
